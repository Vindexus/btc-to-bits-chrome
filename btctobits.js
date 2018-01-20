(function () {
function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_ELEMENT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}
var totalReplaced = 0;
function walkBody () {
  totalReplaced = 0;
  walk(document.body);
  if(totalReplaced > 0) {
    console.log('Repaced ' + totalReplaced + ' BTC amount' + (totalReplaced == 1 ? '' : 's') + ' with bits amounts.');
  }
}

function walk(node)
{
  //I stole this from cloud to butt
  // I stole this function from here:
  // http://is.gd/mwZp7E
  var child, next;

  if ((node.tagName && node.tagName.toLowerCase() == 'input')
      || (node.tagName && node.tagName.toLowerCase() == 'textarea')
      || (node.classList && node.classList.indexOf && (node.classList.indexOf('ace_editor') > -1 || node.classList.indexOf('CodeMirror') > -1))
      || (node.classList && node.classList.contains && (node.classList.contains('ace_editor') || node.classList.contains('CodeMirror')))) {
    return;
  }

  switch ( node.nodeType )
  {
    case 1:  // Element
    case 9:  // Document
    case 11: // Document fragment
      child = node.firstChild;
      while ( child )
      {
        next = child.nextSibling;
        walk(child);
        child = next;
      }
      break;

    case 3: // Text node
      handleText(node);
      break;
  }
}


var reg = new RegExp(/(bits \()?([0-9,.]+)\s?(btc|bitcoins|bitcoin)/gi);

function handleText(textNode)
{
  var match;
  var newText = textNode.nodeValue;
  var btcPlaceholder = {};
  var relacedThisNode = 0;
  do {
    match = reg.exec(textNode.nodeValue);
    if(match) {
      //console.log('match',match);
    }
    if(match != null && match[2] != ',' && !match[1]) {
      var btcPrice = match[0];

      var numparts = match[2].split(',');
      var numstr = "";

      //Here I am trying to detect someone writing "12,5" and meaning 12.5
      if(numparts.length == 2 && numparts[1].toString().length < 3) {
        numstr = numparts.join('.');
      }
      else {
        numstr = numparts.join('');
      }

      var num = new Number(numstr);
      if(!isNaN(num)) {
        var placehodlerId = Math.random() + '_' + new Date().getTime();
        btcPlaceholder[placehodlerId] = btcPrice;
        var bits = (num * 1000000).toLocaleString();
        var replacement = bits + ' bits (' + placehodlerId + ')';
        newText = newText.replace(match[0], replacement);
        totalReplaced++;
        relacedThisNode++;
      }
    }
  }
  while(match != null);

  if(relacedThisNode > 0) {
    Object.keys(btcPlaceholder).forEach(function (id) {
      newText = newText.replace(id, btcPlaceholder[id]);
    });
    textNode.nodeValue = newText;
  }
}

walkBody();

var replaceTimeout = null;
document.body.addEventListener('DOMSubtreeModified', function () {
  clearTimeout(replaceTimeout);
  replaceTimeout = setTimeout(function () {
    walkBody();
  }, 250);
});

})();