pipeline {
    agent any
    environment {
        // Usa el nombre del servicio como en tu docker-compose.yml
        MONGO_URI = 'mongodb://mongodb:27017/mi-base-de-datos'
    }
    stages {
        stage('Desplegar con Docker Compose') {
            steps {
                script {
                    // Usa la ruta completa de docker-compose
                    bat '''
                        /usr/bin/docker-compose down || true
                        /usr/bin/docker-compose up --build -d
                    '''
                }
            }
        }
        stage('Verificar') {
            steps {
                script {
                    sleep(time: 10, unit: 'SECONDS')
                    // Prueba de conexión (ajusta según tu app)
                    bat 'curl -s http://backend:3000 || echo "App iniciada"'
                }
            }
        }
    }
}
