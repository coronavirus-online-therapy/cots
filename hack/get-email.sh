#!/bin/sh

user_pool=us-west-2_n7i1jqqxo 
email=$1
aws cognito-idp list-users --user-pool-id $user_pool --filter "email = \"$email\"" --query "Users[0]"
