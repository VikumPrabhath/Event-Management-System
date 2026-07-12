pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'vikumprabhath40/event-backend:latest'
        DOCKER_IMAGE_FRONTEND = 'vikumprabhath40/event-frontend:latest'
        // Use Jenkins credentials for MongoDB URI (add this in Jenkins → Credentials → System)
        MONGODB_URI = credentials('mongodb-uri')
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/VikumPrabhath/Event-Management-System.git'
            }
        }

        stage('Build Backend (Maven)') {
            steps {
                sh '''
                    cd Backend/event-management-system
                    chmod +x mvnw
                    ./mvnw clean package -DskipTests
                '''
            }
        }

        stage('Build Frontend (npm)') {
            steps {
                sh '''
                    cd frontend
                    npm install
                    CI=false npm run build
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE_BACKEND} -f Backend/event-management-system/Dockerfile Backend/event-management-system/'
                sh 'docker build -t ${DOCKER_IMAGE_FRONTEND} -f frontend/Dockerfile frontend/'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('', 'docker-hub-credentials') {
                        sh 'docker push ${DOCKER_IMAGE_BACKEND}'
                        sh 'docker push ${DOCKER_IMAGE_FRONTEND}'
                    }
                }
            }
        }

        stage('Deploy to App Server') {
            steps {
                sh '''
                    ssh app-server@192.168.45.139 "
                        docker pull ${DOCKER_IMAGE_BACKEND}
                        docker pull ${DOCKER_IMAGE_FRONTEND}
                        docker stop backend-container frontend-container || true
                        docker rm backend-container frontend-container || true
                        docker run -d -p 8081:8081 --name backend-container -e MONGODB_URI='${MONGODB_URI}' ${DOCKER_IMAGE_BACKEND}
                        docker run -d -p 80:80 --name frontend-container ${DOCKER_IMAGE_FRONTEND}
                    "
                '''
            }
        }
    }

    post {
        always {
            // Clean up on Jenkins VM (just in case)
            sh 'docker stop backend-container frontend-container || true'
            sh 'docker rm backend-container frontend-container || true'
        }
    }
}
