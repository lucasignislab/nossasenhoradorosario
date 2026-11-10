#!/bin/sh
# O launcher de preview do Kimi Work chama o dev server com "--host <valor>",
# mas o Next.js só aceita "--hostname". Este wrapper traduz o argumento.
cd "$(dirname "$0")"

args=""
while [ $# -gt 0 ]; do
  case "$1" in
    --host) args="$args --hostname" ;;
    --host=*) args="$args --hostname=${1#--host=}" ;;
    *) args="$args '$1'" ;;
  esac
  shift
done

eval "exec npx next dev $args"
