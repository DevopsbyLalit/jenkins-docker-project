pipeline {
  agent { label 'lalit' }

  environment {
    IMAGE = "lalit25/grocery-app"
    TAG   = "${env.GIT_COMMIT.take(7)}"
    DOCKER_CREDS = "dockerhub-creds"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
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
          sh """
            echo "$PASS" | docker login -u "$USER" --password-stdin
            docker push ${IMAGE}:${TAG}
            docker push ${IMAGE}:latest
            docker logout
          """
        }
      }
    }

    stage('Run Container on Agent') {
      steps {
        sh "docker ps -q --filter 'name=grocery-app' | xargs -r docker stop"
        sh "docker ps -a -q --filter 'name=grocery-app' | xargs -r docker rm"
        sh "docker run -d --name grocery-app -p 3000:3000 ${IMAGE}:latest"
      }
    }
  }

  post {
    success {
      echo "SUCCESS: Image pushed → ${IMAGE}:${TAG}"
    }
    failure {
      echo "FAILED: Check console logs"
    }
  }
}
