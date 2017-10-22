node('LK') {
    
    def tag = 'latest'
                // generate production name
            JENKINS_JOB   = env.JOB_NAME.split('/')[0]
            PROJECT_NAME  = JENKINS_JOB.split('-')[0]
            SERVICE_NAME  = JENKINS_JOB.split('-')[1]
            SERVICE_TYPE  = JENKINS_JOB.split('-')[2]
            DOCKER_IMAGE  = PROJECT_NAME + "-" + SERVICE_NAME + "-" + SERVICE_TYPE
            STACK_SERVICE = PROJECT_NAME + "_" + SERVICE_NAME + "-" + SERVICE_TYPE

    // development builds are marked with 'dev' tag
    if(env.BRANCH_NAME == 'dev'){
        tag = env.BRANCH_NAME
    }

	// put pre-built testing too..
  	stage('Build') {
        echo 'Building....'
        //sh 'git submodule update --init --recursive'
        
      	checkout scm
            sh "docker build -t ${DOCKER_REGISTRY}/" + DOCKER_IMAGE + ":dev-${BUILD_NUMBER} ."
            sh "docker tag ${DOCKER_REGISTRY}/" + DOCKER_IMAGE + ":dev-${BUILD_NUMBER} ${DOCKER_REGISTRY}/" + DOCKER_IMAGE + ":${tag}"
    }
    stage('Test') {
        echo 'Testing.... Nothing to Do'
    }
  	stage('Push to Registry'){
      	    sh "docker push ${DOCKER_REGISTRY}/" + DOCKER_IMAGE + ":${tag}"
            sh "docker push ${DOCKER_REGISTRY}/" + DOCKER_IMAGE + ":${tag}-${BUILD_NUMBER}"
  	}
  	stage('Deploy') {
        echo 'Deploying....'

        // execute Dowcker update...
        // improve logic to support other nodes..
        if(env.BRANCH_NAME=='dev'){
            echo 'development server deployment'
            sh "docker-compose --file /home/samitha/sims-docker-compose/docker-compose.yml up -d"
        }else{
            
          	// execute docker command remotely from prime
            withEnv(['DOCKER_HOST=tcp://192.168.1.51:2375']) {
                sh 'echo doing registry updates... $DOCKER_HOST'
                sh "docker service update --force --image ${DOCKER_REGISTRY}/" + DOCKER_IMAGE + ":latest --update-parallelism 1 --update-delay 30s " + STACK_SERVICE
            }
        }
   	}
}