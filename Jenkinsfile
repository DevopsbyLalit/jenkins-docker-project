pipeline {
  agent { label 'agent' }

  environment {
    IMAGE = "lalit25/grocery-app"   // <-- Your Docker Hub repo name
    TAG = "${env.GIT_COMMIT.take(7)}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker image') {
      steps {
        sh "docker build -t ${IMAGE}:${TAG} ."
        sh "docker tag ${IMAGE}:${TAG} ${IMAGE}:latest"
      }
    }

    stage('Run Docker container') {
      steps {
        // Stop old container if running
        sh "docker ps -q --filter 'name=grocery-app' | xargs -r docker stop"
        sh "docker ps -a -q --filter 'name=grocery-app' | xargs -r docker rm"

        // Run new container
        sh "docker run -d --name grocery-app -p 3000:3000 ${IMAGE}:latest"
      }
    }
  }

  post {
    success {
      echo "Pipeline Completed Successfully 🚀"
      echo "Docker Image: ${IMAGE}:${TAG}"
    }
    failure {
      echo "Pipeline Failed ❌"
    }
  }
}
