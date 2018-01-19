(function () {function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_ELEMENT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

var reg = new RegExp(/([0-9,]?\.?[0-9,]+?)\s?(btc|bitcoins|bitcoin)/gi);
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
      if(match != null && match[1] != ',') {
        hasMatches = true;
        var btcPrice = match[0];

        var numparts = match[1].split(',');
        var numstr = "";

        //Here I am trying to detect someone writing "12,5" and meaning 12.5
        if(numparts.length == 2 && numparts[1].toString().length < 3) {
          numstr = numparts.join('.');
        }
        else {
          numstr = numparts.join(',');
        }

        var num = new Number(numstr);
        var placehodlerId = Math.random() + '_' + new Date().getTime();
        btcPlaceholder[placehodlerId] = btcPrice;
        var bits = (num * 1000000).toLocaleString();
        var replacement = bits + ' bits (' + placehodlerId + ')';
        newText = newText.replace(match[0], replacement);
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