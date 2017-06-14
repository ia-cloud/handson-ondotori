# !/usr/bin/env bash

# needs following envvars
# - AWS_ACCOUNT_ID
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY

# define vars
AWS_DEFAULT_REGION=us-east-1
AWS_ECS_TASKDEF_NAME=ia-cloud-handson-webapp
AWS_ECS_CLUSTER_NAME=ia-cloud-handson-cluster
AWS_ECS_SERVICE_NAME=ia-cloud-handson-service
AWS_ECR_REP_NAME=ia-cloud-handson-webapp

JQ="jq --raw-output --exit-status"

# configure awscli
configure_aws_cli(){
  aws --version
  aws configure set default.region ${AWS_DEFAULT_REGION}
  aws configure set default.output json
}

# push docker image
push_ecr_image(){
  docker build -t $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/${AWS_ECR_REP_NAME}:$TRAVIS_COMMIT .
  eval $(aws ecr get-login --region ${AWS_DEFAULT_REGION})
  docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/${AWS_ECR_REP_NAME}:$TRAVIS_COMMIT
}

# create task
create_task_def(){
  template='[
    {
      "name": "%s",
      "image": "%s.dkr.ecr.%s.amazonaws.com/%s:%s",
      "essential": true,
      "memory": 200,
      "cpu": 10,
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 80
        }
      ]
    }
  ]'

  task_def=$(printf "$template", ${AWS_ECS_TASKDEF_NAME} ${AWS_ACCOUNT_ID} ${AWS_DEFAULT_REGION} ${AWS_ECR_REP_NAME} ${TRAVIS_COMMIT})
}

# register task definitions
register_definitions(){
  if revision=$(aws ecs register-task-definition --container-definitions "$task_def" --family ${AWS_ECS_TASKDEF_NAME} | $JQ '.taskDefinition.taskDefinitionArn'); then
    echo "Rivision: $revision"
  else
    echo "Failed to register task definition"
    return 1
  fi
}

# deploy cluster
deploy_cluster(){
  create_task_def
  register_definitions
  if [[ $(aws ecs update-service --cluster ${AWS_ECS_CLUSTER_NAME} --service ${AWS_ECS_SERVICE_NAME} --task-definition $revision | $JQ '.service.taskDefinition') != $revision ]]; then
    echo "Error updating service."
    return 1
  fi

  echo "Deployed!"
  return 0
}

configure_aws_cli
push_ecr_image
deploy_cluster