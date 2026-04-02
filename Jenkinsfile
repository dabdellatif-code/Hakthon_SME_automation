pipeline {
    agent any
    
    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    triggers {
        // Run every day at 9 AM
        cron('0 9 * * *')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    echo "✓ Repository checked out successfully"
                }
            }
        }
        
        stage('Configure Git') {
            steps {
                script {
                    sh '''
                        git config user.name "Jenkins Automation"
                        git config user.email "jenkins@automation.local"
                        git config --global user.name "Jenkins Automation"
                        git config --global user.email "jenkins@automation.local"
                    '''
                    echo "✓ Git configured"
                }
            }
        }
        
        stage('Check for Changes') {
            steps {
                script {
                    def status = sh(script: 'git status --porcelain', returnStdout: true).trim()
                    if (status) {
                        echo "✓ Changes detected:\n${status}"
                    } else {
                        echo "ℹ No changes detected"
                    }
                }
            }
        }
        
        stage('Commit Changes') {
            steps {
                script {
                    sh '''
                        git add -A
                        git commit -m "Auto commit from Jenkins - $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
                    '''
                    echo "✓ Changes committed"
                }
            }
        }
        
        stage('Push to Repository') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'github-credentials', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh '''
                            git push https://${GIT_USER}:${GIT_PASS}@github.com/dabdellatif-code/Hakthon_SME_automation.git dev
                        '''
                    }
                    echo "✓ Changes pushed to repository"
                }
            }
        }
    }
    
    post {
        success {
            echo "✓ Pipeline executed successfully"
        }
        failure {
            echo "✗ Pipeline failed - Check logs for details"
        }
    }
}
