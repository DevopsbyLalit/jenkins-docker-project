pipeline {
  agent { label 'lalit' }

  environment {
    IMAGE = "lalit25/portfolio"
    TAG   = "${env.GIT_COMMIT.take(7)}"
    DOCKER_CREDS = "dockerhub-creds"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build Image') {
      steps {
        sh "docker build -t ${IMAGE}:${TAG} ."
        sh "docker tag ${IMAGE}:${TAG} ${IMAGE}:latest"
      }
    }

    stage('Push Image to DockerHub') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDS}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh '''
            echo "$PASS" | docker login -u "$USER" --password-stdin
            docker push ${IMAGE}:${TAG}
            docker push ${IMAGE}:latest
            docker logout
          '''
        }
      }
    }

    stage('Run Container on Agent') {
      steps {
        // Stop & remove old container (if exists)
        sh "docker ps -q --filter 'name=portfolio-app' | xargs -r docker stop || true"
        sh "docker ps -a -q --filter 'name=portfolio-app' | xargs -r docker rm || true"

        // Run new container mapping container:80 -> host:3000
        sh "docker run -d --name portfolio-app -p 3000:80 ${IMAGE}:latest"
      }
    }
  }

  post {
    success { echo "Deployed ${IMAGE}:latest -> host:3000" }
    failure { echo "Pipeline Failed" }
  }
}
