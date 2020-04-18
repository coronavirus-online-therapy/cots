#!/bin/sh

user_pool=us-west-2_n7i1jqqxo 
aws cognito-idp list-users --user-pool-id $user_pool  --query "Users[].Attributes[?Name=='email'].Value" --output text|wc -l
