pipeline {
    agent { label 'lalit' }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t grocery-app:latest .'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                sh 'docker run -d -p 3000:3000 grocery-app:latest'
            }
        }
    }

    post {
        success {
            echo "Pipeline Successfully Completed 🚀"
        }
    }
}

