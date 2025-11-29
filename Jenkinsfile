pipeline {
  agent { label 'lalt' }

  environment {
    IMAGE = "lalit25/grocery-app"              // <- your DockerHub repo
    TAG   = "${env.GIT_COMMIT.take(7)}"
    DOCKER_CREDS = "dockerhub-creds"           // credential id for Docker Hub
    SSH_CRED = "deploy-ssh-key"                // credential id for deploy SSH (optional)
    DEPLOY_HOST = ""                           // <- put remote IP (or leave blank to skip deploy)
    DEPLOY_USER = ""                           // <- put remote username
    REMOTE_DIR = "deploy_dir"                  // remote dir where docker-compose.yml exists (or will be created)
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build image') {
      steps {
        // Build using Docker on the agent
        sh "docker build -t ${IMAGE}:${TAG} ."
        sh "docker tag ${IMAGE}:${TAG} ${IMAGE}:latest"
      }
    }

    stage('Push to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDS}", usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            docker push ${IMAGE}:${TAG}
            docker push ${IMAGE}:latest
            docker logout
          '''
        }
      }
    }

    stage('Remote Deploy (optional)') {
      when {
        expression { return env.DEPLOY_HOST?.trim() }
      }
      steps {
        // Use sshagent to make the private key available
        sshagent (credentials: ["${SSH_CRED}"]) {
          // create remote deploy_dir and download docker-compose if not present, then pull and restart
          sh """
            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
              mkdir -p ~/${REMOTE_DIR}
              cd ~/${REMOTE_DIR}
              # create a minimal docker-compose.yml if missing (this only runs once)
              if [ ! -f docker-compose.yml ]; then
                cat > docker-compose.yml <<'YAML'
                version: "3.8"
                services:
                  grocery:
                    image: ${IMAGE}:latest
                    restart: unless-stopped
                    ports:
                      - "3000:3000"
                    environment:
                      - NODE_ENV=production
                YAML
              fi

              # pull and start the new image
              docker pull ${IMAGE}:latest || true
              docker-compose pull || true
              docker-compose up -d --no-deps --build || true
            '
          """
        }
      }
    }
  } // stages

  post {
    success {
      echo "Done: ${IMAGE}:${TAG}"
      script {
        if (env.DEPLOY_HOST?.trim()) {
          echo "Deployed to ${DEPLOY_HOST} as ${DEPLOY_USER}"
        } else {
          echo "Not deployed — DEPLOY_HOST empty. Image pushed to Docker Hub."
        }
      }
    }
    failure {
      echo "Pipeline failed — check console output"
    }
  }
}
