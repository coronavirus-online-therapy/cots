#!/bin/sh

user_pool=us-west-2_n7i1jqqxo 
email=$1
id=$(aws cognito-idp list-users --user-pool-id $user_pool --filter "email = \"$email\"" --query "Users[0].Username" --output text)
echo $id
aws cognito-idp admin-delete-user --user-pool-id $user_pool --username $id
