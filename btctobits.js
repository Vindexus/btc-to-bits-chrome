(function () {function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_ELEMENT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

var reg = new RegExp(/([0-9,]?\.?[0-9,]+?)\s?btc/gi);
var texts = textNodesUnder(document.body);
var totalReplaced = 0;
texts.forEach(function (node) {
  if(node.nodeType == 1 && node.children.length == 0) {
    var match;
    var newText = node.innerText;
    var hasMatches = false;
    var btcPlaceholder = {};
    do {
      match = reg.exec(node.innerText);
      if(match != null) {
        hasMatches = true;
        var btcPrice = match[0];

        var num = new Number(match[1].split(',').join(''));
        var placehodlerId = Math.random() + '_' + new Date().getTime();
        btcPlaceholder[placehodlerId] = btcPrice;
        var bits = (num * 1000000).toLocaleString() + ' bits (' + placehodlerId + ')';
        newText = newText.replace(match[0], bits);
        totalReplaced++
      }
    }
    while(match != null);

    if(hasMatches) {
      Object.keys(btcPlaceholder).forEach(function (id) {
        newText = newText.replace(id, btcPlaceholder[id]);
      })
      node.innerText = newText;
    }
  }
})
console.log('Replaced ' + totalReplaced + ' BTC amounts with bits');
})();