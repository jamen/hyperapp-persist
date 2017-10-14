
module.exports = (app, opts) => props => {
  opts = opts || {}
  var storage = opts.storage || 'hyperapp-persist'
  var include = opts.include || []
  var _init = props.init
  
  props.init = function (state, actions) {
    if (_init) _init.apply(null, arguments)

    var data = localStorage.getItem(storage)
    if (data) actions.__restore(JSON.parse(data))
    
    window.addEventListener('unload', function () {
      actions.__save()
    })
  }

  props.actions.__restore = function (_s, _a, previous) {
    return previous
  }
  
  props.actions.__save = function (state) {
    localStorage.setItem(storage, JSON.stringify(state, include))
  }
  
  return app(props)
} 
