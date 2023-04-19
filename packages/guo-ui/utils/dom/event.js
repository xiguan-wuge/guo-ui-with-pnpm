import {isServer} from '../index'

export let supportPassive = false
export function on(target, event, handler, passive) {
  console.log(
    'target', target, '\n', 
    'event', event, '\n', 
    'handler', handler, '\n', 
    'passive', passive, '\n', 
  );
  
  if(!isServer) {
    target.addEventListener(
      event,
      handler,
      supportPassive ? {capture: false, passive}: false
    )
  }
}

export function off(target, event, handler) {
  if(!isServer) {
    target.removeEventListener(event, handler)
  }
}