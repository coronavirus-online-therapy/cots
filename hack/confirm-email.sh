#!/bin/sh

set -e

user_pool=us-west-2_n7i1jqqxo 
email=$1
id=$(aws cognito-idp list-users --user-pool-id $user_pool --filter "email = \"$email\"" --query "Users[0].Username" --output text)
aws cognito-idp admin-update-user-attributes --user-pool-id $user_pool --username $id --user-attributes Name="email_verified",Value="true"
aws cognito-idp admin-confirm-sign-up --user-pool-id $user_pool --username $id
aws cognito-idp list-users --user-pool-id $user_pool --filter "email = \"$email\"" --query "Users[0]"
