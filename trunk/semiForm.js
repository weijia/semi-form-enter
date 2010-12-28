//var curInput = null;
var curMenuDiv = null;
var menuListStr = null;
chrome.extension.sendRequest({greeting: "hello"}, function(response) {
  //console.log(response.farewell);
  //localStorage["menuListStr"] = response.menuListStr;
  menuListStr = response.menuListStr;
});


function semiFormCallbackFunction() {
  //console.log("event fired");
  var imgURL = null;
  var theDiv = null;
  //console.log($(this).css('float'));
  if($(this).get(0).parentDiv == null)
  {
    if(($(this).css('float') == 'left')||($(this).css('float') == 'right'))
    {
      $(this).wrapAll('<div style="float:'+$(this).css('float')+'">');
    }
    $(this).get(0).parentDiv = $(this).parent();
  }
  //console.log($(this).get(0).tagName);
  if($(this).get(0).semiFormIcon == null)
  {
    //Replace the icon according to the current position of the icon
    imgURL = chrome.extension.getURL("mini-edit.png");
    //theDiv = $("<div><img src=\""+imgURL+"\"></div>");
    theDiv = $("<img src=\""+imgURL+"\">");
    theDiv.get(0).inputField = $(this).get(0);
    $(this).get(0).semiFormIcon = theDiv.get(0);
    theDiv.click(
      function(e)
      {
        //alert("div clicked");
        if(curMenuDiv != null)
          curMenuDiv.remove();

        var menuDiv = $("<div></div>");
        var menuUl = $("<ul></ul>");
        //menuListStr = chrome.cookies.get({"url":cookieId})//localStorage["menuListStr"];
        //menuListStr = localStorage["menuListStr"];
        var menuList = menuListStr.split('\n');
        for(i=0;i<menuList.length;i++)
        {
          if(menuList[i] == "")
            continue;
          var domInput = $(this).get(0).inputField;
          menuItem = $("<li>"+menuList[i]+"</li>").css({"margin":2,"padding":2,"color":"black"});
          menuItem.css({"list-style-type":"none"});
          menuItem.get(0).inputField = domInput;
          menuItem.mouseover(
            function ()
            {
              $(this).css({"background":"blue"});
            }
          );
          menuItem.mouseout(
            function ()
            {
              $(this).css({"background":"white"});
            }
          );
          menuItem.click(
            function ()
            {
              //alert("menu clicked");
              if(curMenuDiv != null)
              {
                curMenuDiv.remove();
                curMenuDiv = null;
              }
              $($(this).get(0).inputField).attr('value', $(this).text());
              $(this).parent().parent().remove();
            }
          );
          menuUl.append(menuItem);
        }
        menuDiv.append(menuUl);
        var iconPos = $(this).offset();
        menuUl.css({"margin":2,"padding":2});
        menuDiv.css({'position':'absolute','top':iconPos.top,'left':iconPos.left-menuDiv.width(),"z-index":999,"background":"white", "border-radius":"3px","border": "solid 1px black"});
        curMenuDiv = menuDiv;
        $("body").append(menuDiv);
        
        e.stopPropagation();
      }
    );
    ////var pos = $(this).position();
    //The following returns a absolute position
    //var pos = $(this).offset();
    //Relative position will let the icon move with the existing input element.
    ////theDiv.css({'position':'absolute','z-index':999,'top':pos.top,'left':pos.left+$(this).width(),"max-width":"400px"});
    theDiv.css({"position":"relative",'display':'inline','margin':'0px'});
    //Make child nodes follow new added div element
    $(this).parent().css({"white-space":"nowrap"/*"overflow":"visible"*/});
    var left = -12;
    //console.log(left);
    theDiv.css({"left":left+"px"});
    //The following must be the last, so the div's width will not be extended.
    $(this).after(theDiv);
  }
  else
  {
    //theDiv = $($(this).get(0).semiFormIcon);
  }

  /*
  //Update the position when clicked
  $(this).click(
    function() {
      var pos = $(this).offset();
      $($(this).get(0).semiFormIcon).css({'position':'absolute','z-index':999,'top':pos.top,'left':pos.left+$(this).width()-theDiv.width(),"max-width":"400px"});
    }
  );*/
}

function installSemiFormCallbackFunction(elem)
{
  //console.log(elem);
  //console.log($(elem));
  $(elem).load(function ()
    {
      //console.log($(this.contentDocument).find("input:visible[type=input],input:visible[type=text],input[type=password]"));
      $(this.contentDocument).find("input:visible[type=input],input:visible[type=text],input[type=password]").each(semiFormCallbackFunction);
      $(this.contentDocument).find("input:visible[type=input],input:visible[type=text],input[type=password]").live("mouseover",semiFormCallbackFunction);
      //$("input:visible[type=input],input:visible[type=text],input[type=password]").livequery("mouseover",semiFormCallbackFunction);
      //$(this.contentDocument).find("input:visible[type=input],input:visible[type=text],input[type=password]").livequery("mouseover",semiFormCallbackFunction);
      
      //$("input:visible[type=input],input:visible[type=text],input[type=password]").livequery(semiFormCallbackFunction);
    }
  );
}

//console.log("started");
$("input:visible[type=input],input:visible[type=text],input[type=password]").each(semiFormCallbackFunction);
$("input:visible[type=input],input:visible[type=text],input[type=password]").live("mouseover", semiFormCallbackFunction);
//$("input:visible[type=input],input:visible[type=text],input[type=password]").livequery(semiFormCallbackFunction);


//Install callback for iframes
//console.log($("iframe")).each(installSemiFormCallbackFunction);
//console.log($("iframe"));
//console.log($("iframe").contents()[1]);
for(i=0;i<$("iframe").length;i++)
{
  installSemiFormCallbackFunction($("iframe")[i]);
  //installSemiFormCallbackFunction($("iframe")[1]);
}

//Install callback for removing menus
$("body").click(
  function ()
  {
    if(curMenuDiv != null)
    {
      curMenuDiv.remove();
      curMenuDiv = null;
    }
  }
);

