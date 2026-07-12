pipeline {
    // Run this pipeline on any available Jenkins agent
    agent any

    // Define environment variables for Docker Hub (We will set these up in Jenkins)
    environment {
        // CHANGE THIS TO YOUR DOCKER HUB USERNAME
        DOCKER_IMAGE_BACKEND = 'vikumprabhath40/event-backend:latest'
        DOCKER_IMAGE_FRONTEND = 'vikumprabhath40/event-frontend:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                // Pull the latest code from your GitHub repository
                git branch: 'main',
                    url: 'https://github.com/VikumPrabhath/Event-Management-System.git'
            }
        }

        stage('Build Backend (Maven)') {
            steps {
                // Navigate to backend, skip tests for now (to save time)
                sh '''
                    cd Backend/event-management-system
                    chmod +x mvnw
                    ./mvnw clean package -DskipTests
                '''
            }
        }

        stage('Build Frontend (npm)') {
            steps {
                // Install dependencies and build the React app
                sh '''
                    cd frontend
                    npm install
                    CI=false npm run build   # ✅ This tells React to not treat warnings as errors
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                // Build the Backend Docker image using the Dockerfile we created
                sh 'docker build -t ${DOCKER_IMAGE_BACKEND} -f Backend/event-management-system/Dockerfile Backend/event-management-system/'

                // Build the Frontend Docker image
                sh 'docker build -t ${DOCKER_IMAGE_FRONTEND} -f frontend/Dockerfile frontend/'
            }
        }

        stage('Push to Docker Hub (Optional)') {
            steps {
                script {
                    docker.withRegistry('', 'docker-hub-credentials') {
                    sh 'docker push vikumprabhath40/event-backend:latest'
                    sh 'docker push vikumprabhath40/event-frontend:latest'
                    }
                }
            }
        }

        stage('Deploy to App Server') {
            steps {
                sh '''
                    ssh app-server@192.168.45.139 '
                        docker pull vikumprabhath40/event-backend:latest
                        docker pull vikumprabhath40/event-frontend:latest
                        docker stop backend-container frontend-container || true
                        docker rm backend-container frontend-container || true
                        docker run -d -p 8081:8081 --name backend-container vikumprabhath40/event-backend:latest
                        docker run -d -p 80:80 --name frontend-container vikumprabhath40/event-frontend:latest
                    '
                '''
            }
        }

    post {
        // Clean up old containers/images after build (to save space)
        always {
            sh 'docker stop backend-container || true'
            sh 'docker rm backend-container || true'
            sh 'docker stop frontend-container || true'
            sh 'docker rm frontend-container || true'
        }
    }
}
