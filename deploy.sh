#!/bin/zsh

aws cloudformation list-type-versions --type RESOURCE --type-name Surnet::ParameterStore::Secret | jq '.TypeVersionSummaries[] | .Arn' | xargs -n1 aws cloudformation --profile dev deregister-type --arn
aws cloudformation deregister-type --type RESOURCE --type-name Surnet::ParameterStore::Secret || true
cfn generate
cfn submit --set-default