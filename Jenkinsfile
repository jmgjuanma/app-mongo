pipeline {
    agent any
    environment {
        MONGO_URI = 'mongodb://mongodb:27017/mi-base-de-datos'  // Usa la misma URL que en tu docker-compose.yml
    }
    stages {
        stage('Clonar Repositorio') {
            steps {
                git branch: 'main', url: 'https://github.com/jmgjuanma/app-mongo.git'  // Reemplaza con tu repo
            }
        }
        stage('Construir y Desplegar') {
            steps {
                script {
                    // Detener y eliminar contenedores previos (opcional)
                    sh 'docker-compose down || true'
                    // Construir imágenes y levantar servicios
                    sh 'docker-compose up --build -d'
                }
            }
        }
        stage('Verificar') {
            steps {
                script {
                    // Esperar 10 segundos para que los servicios inicien
                    sleep 10
                    // Opcional: Hacer una prueba HTTP al backend
                    sh '''
                        curl -s http://localhost:3000 | grep "Bienvenido" || {
                            echo "❌ La app no respondió correctamente";
                            exit 1;
                        }
                    '''
                }
            }
        }
    }
    post {
        always {
            // Opcional: Limpiar contenedores después de las pruebas
            sh 'docker-compose down || true'
        }
    }
}
