/// <reference path="../../../../typings/angularjs/angular.d.ts"/>
/// <reference path="../model/util.ts"/>

var conversationDire = angular.module("webim.conversation.directive", ["webim.main.server", "webim.conversation.server"]);

conversationDire.directive('atshowDire', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope: any, element: angular.IRootElementService, attrs: angular.IAttributes, ngModel: angular.INgModelController) {
            scope.atShow = false;
            element.bind("click", function (e) {
                scope.cursorPos = document.getSelection().focusOffset;
            });
            element.bind("keyup", function (e) {
                 var keyCode = e.keyCode;
                 var obj = document.getElementById("message-content");
                 var caretPos = scope.getCaretPosition(obj);
                //  e = e || event;
                if(!scope.showGroupList){
                   return;
                }
                if(obj.textContent.length > 500 && keyCode!= 8){
                   e.preventDefault();
                   return;
                }
             　　if ((e.shiftKey && e.keyCode == '2'.charCodeAt(0)) ) {
                   var lastChar = '';
                   if(caretPos > 1){
                     lastChar = obj.textContent.substr(caretPos - 2, 1);
                     if(lastChar != ' '){
                       return;
                     }
                   }
                  scope.atShow = true;
                  scope.searchStr = scope.defaultSearch ? scope.lastSearchStr : '';
                  scope.cursorPos = caretPos;
                  scope.$apply();
                  var obj = document.getElementById("message-content");
                  var hidInput = document.getElementById("TestInput");
                  var styleObj = window.getComputedStyle(obj, null);
                  var lineWidth = obj.clientWidth - 80;
                  var sel = document.getSelection(),
                      text = obj.textContent.slice(0, sel.focusOffset);
                  hidInput.style.visibility = 'visible';
                  hidInput.innerText = text;
                  hidInput.style.fontSize = styleObj.getPropertyValue('font-size');
                  hidInput.style.fontFamily = styleObj.getPropertyValue('font-family');
                  hidInput.style.visibility = 'hidden';
                  var actWidth = (hidInput.clientWidth + 1) % lineWidth;
                  var lineNum = (hidInput.clientWidth + 1) / lineWidth;
                  var atDivHeight = scope.showGroupList.length > 6 ? 36*6 : 36*scope.showGroupList.length;
                  $('div.arobase').css('bottom', obj.clientHeight - lineNum * hidInput.clientHeight);
                  $('div.arobase').css('left', actWidth);
                }
                else{
                   if(!scope.atShow){
                     var obj = document.getElementById("message-content");
                    //  var caretPos = scope.getCaretPosition(obj);
                     var text = obj.textContent.slice(0, caretPos);
                     if (keyCode == 8 && text.indexOf('@') > -1){
                        // 判断名字是否在列表中,如果在,则删除该@
                        scope.delAtContent(caretPos);
                     }
                     else if(keyCode !== 16){
                       scope.defaultSearch = false;
                     }
                     scope.$apply();
                     return;
                   }
                   if(keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90){
                      scope.searchStr = scope.searchStr + String.fromCharCode(keyCode);
                      scope.$apply();
                   }
                   else if(keyCode == 8 && scope.searchStr){
                     if(scope.searchStr.length > 0){
                       scope.searchStr = scope.searchStr.substr(0, scope.searchStr.length - 1);
                       scope.$apply();
                     }
                   }
                   else if(keyCode != 16){
                     scope.atShow = false;
                   }
                }
            });

            // element.bind("keydown", function (e) {
            //      var keyCode = e.keyCode;
            //      var obj = document.getElementById("message-content");
            //      var caretPos = scope.getCaretPosition(obj);
            //     //  e = e || event;
            //     if(!scope.showGroupList){
            //        return;
            //     }
            //     if(obj.textContent.length > 500 && keyCode!= 8){
            //        e.preventDefault();
            //        return;
            //     }
            //  　　if ((e.shiftKey && e.keyCode == '2'.charCodeAt(0)) ) {
            //       scope.atShow = true;
            //       scope.searchStr = scope.defaultSearch ? scope.lastSearchStr : '';
            //       scope.cursorPos = caretPos;
            //       var obj = document.getElementById("message-content");
            //       var hidInput = document.getElementById("TestInput");
            //       var styleObj = window.getComputedStyle(obj, null);
            //       var lineWidth = obj.clientWidth - 80;
            //       var sel = document.getSelection(),
            //           text = obj.textContent.slice(0, sel.focusOffset);
            //       hidInput.style.visibility = 'visible';
            //       hidInput.innerText = text;
            //       hidInput.style.fontSize = styleObj.getPropertyValue('font-size');
            //       hidInput.style.fontFamily = styleObj.getPropertyValue('font-family');
            //       hidInput.style.visibility = 'hidden';
            //       var actWidth = (hidInput.clientWidth + 1) % lineWidth;
            //       var lineNum = (hidInput.clientWidth + 1) / lineWidth;
            //       var atDivHeight = scope.showGroupList.length > 6 ? 36*6 : 36*scope.showGroupList.length;
            //       $('div.arobase').css('bottom', obj.clientHeight - lineNum * hidInput.clientHeight);
            //       $('div.arobase').css('left', actWidth);
            //     }
            //     else{
            //        if(!scope.atShow){
            //          var obj = document.getElementById("message-content");
            //         //  var caretPos = scope.getCaretPosition(obj);
            //          var text = obj.textContent.slice(0, caretPos);
            //          if (keyCode == 8 && text.indexOf('@') > -1){
            //             // 判断名字是否在列表中,如果在,则删除该@
            //             scope.delAtContent(caretPos);
            //          }
            //          else if(keyCode !== 16){
            //            scope.defaultSearch = false;
            //          }
            //          return;
            //        }
            //        if(keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90){
            //           scope.searchStr = scope.searchStr + String.fromCharCode(keyCode);
            //        }
            //        else if(keyCode == 8 && scope.searchStr){
            //          if(scope.searchStr.length > 0){
            //            scope.searchStr = scope.searchStr.substr(0, scope.searchStr.length - 1);
            //          }
            //        }
            //        else{
            //          scope.atShow = false;
            //        }
            //     }
            // });
        }
    };
});

conversationDire.directive("tagInput",function() {
    return {
        restrict: "E",
        template: '<div class="input-tag" data-ng-repeat=\"tag in tagArray()\">{{tag}}</div>',
        scope: {
          inputTags: '=taglist',
          autocomplete: '=autocomplete'
        }, link: function($scope: any, ele: angular.IRootElementService, attrs: any) {
             $scope.defaultWidth = 200;
             if($scope.autocomplete){

             }
             $scope.tagArray = function() {
                if ($scope.inputTags === undefined) {
                  return [];
                }
                return $scope.inputTags.split(',').filter(function(tag: string) {
                  return tag !== "";
                });
            };

            $scope.addTag = function() {
              var tagArray: string[];
              if ($scope.tagText.length === 0) {
                return;
              }
              tagArray = $scope.tagArray();
              tagArray.push($scope.tagText);
              $scope.inputTags = tagArray.join(',');
              return $scope.tagText = "";
            };

            $scope.deleteTag = function(key: number) {
              var tagArray: string[];
              tagArray = $scope.tagArray();
              if (tagArray.length > 0 && $scope.tagText.length === 0 && key === undefined) {
                tagArray.pop();
              } else {
                if (key !== undefined) {
                  tagArray.splice(key, 1);
                }
              }
              return $scope.inputTags = tagArray.join(',');
            };

            ele.bind("keydown", function(e) {
             var key: number;
             key = e.which;
             if (key === 9 || key === 13) {
               e.preventDefault();
             }
             if (key === 8) {
               return $scope.$apply('deleteTag()');
             }
           });

        }
    }
});

conversationDire.directive("conversationItem", ["$timeout", function($timeout: angular.ITimeoutService) {
    return {
        restrict: "EA",
        templateUrl: 'assets/template/messagetemplate.html',
        scope: {
            item: "="
        }, link: function(scope: any, ele: angular.IRootElementService, attrs: any) {
            if (scope.item.senderUserId) {
                $timeout(function() {
                    angular.element(ele[0].getElementsByClassName("portrait")[0]).css("background-color", webimutil.Helper.portraitColors[scope.item.senderUserId.charCodeAt(0) % webimutil.Helper.portraitColors.length]);
                }, 50);
            }
        }
    }
}]);

conversationDire.directive('contenteditableDire', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope: any, element: angular.IRootElementService, attrs: angular.IAttributes, ngModel: angular.INgModelController) {
            function replacemy(e: string) {
                // return e.replace(new RegExp("<[\\s\\S.]*?>", "ig"), "");
                return e.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }

            var domElement = <any>element[0];

            // scope.$watch(function() {
            //     return ngModel.$modelValue;
            // }, function(newVal: string) {
            //     if (document.activeElement === domElement) {
            //         return;
            //     }
            //     if (newVal === '' || newVal === attrs["placeholder"]) {
            //         domElement.innerHTML = attrs["placeholder"];
            //         domElement.style.color = "#a9a9a9";
            //     }
            // });
            //
            // element.bind('focus', function() {
            //     if (domElement.innerHTML == attrs["placeholder"]) {
            //         domElement.innerHTML = '';
            //         domElement.style.color = '';
            //     }
            // });
            // element.bind('blur', function() {
            //     if (domElement.innerHTML === '') {
            //         domElement.innerHTML = attrs["placeholder"];
            //         domElement.style.color = "#a9a9a9";
            //     }
            // });

            element.bind('input propertychange', function () {
                if (domElement.innerHTML == attrs["placeholder"] || domElement.innerHTML === '' || domElement.innerHTML == '<br>') {
                  element.empty();
                }
                else{
                  domElement.style.color = "";
                }
            });


            if (!ngModel) return;

            element.bind("paste", function(e: any) {
              var content = '',hasImg = false;
              if(e.clipboardData.items){
                  for (var i = 0; i < e.clipboardData.items.length; i++) {
                      var item = e.clipboardData.items[i];
                      if (item.type.indexOf("image") > -1) {
                        hasImg = true;
                        break;
                      }
                  }
              }
              e.preventDefault();
              if(!hasImg){
                if (e.clipboardData) {
                    content = (e.originalEvent || e).clipboardData.getData('text/plain');
                    content = replacemy(content);
                    document.execCommand('insertText', false, content);
                }
                else if (window.clipboardData) {
                    content = window.clipboardData.getData('Text');
                    content = replacemy(content);
                    document.selection.createRange().pasteHTML(content);
                }
              }
                // var that = this, ohtml = that.innerHTML;
                // timeoutid && clearTimeout(timeoutid);
                // var timeoutid = setTimeout(function() {
                //     that.innerHTML = replacemy(that.innerHTML);
                //     ngModel.$setViewValue(that.innerHTML);
                //     timeoutid = null;
                // }, 50);
            });


            ngModel.$render = function() {
                element.html(ngModel.$viewValue || '');
            };

            webimutil.Helper.browser.msie ? element.bind("keyup paste", read) : element.bind("input", read);

            //仅转义复制的部分
            function read() {
                var html = element.html();
                html = html.replace(/^<br>$/i, "");
                html = html.replace(/<br>/gi, "\n");
                html = replacemy(html);
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if (attrs["stripBr"] && html == '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
});

conversationDire.directive("preplaceholderasdfrs", [function() {
    return {

    }
}])

conversationDire.directive("ctrlEnterKeys", ["$timeout", "mainDataServer", "conversationServer", function($timeout: angular.ITimeoutService, mainDataServer: any, conversationServer: any) {
    return {
        restrict: "A",
        require: '?ngModel',
        scope: {
            fun: "&",
            ctrlenter: "=",
            content: "="
        },
        link: function(scope: any, element: angular.IRootElementService, attrs: angular.IAttributes, ngModel: angular.INgModelController) {
            scope.ctrlenter = scope.ctrlenter || false;
            element.bind("keypress", function(e: any) {
                if (scope.ctrlenter) {
                    if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    }
                } else {
                    if (e.ctrlKey === false && e.shiftKey === false && (e.keyCode === 13 || e.keyCode === 10)) {
                        scope.fun();
                        scope.$parent.$apply();
                        e.preventDefault();
                    } else if (e.ctrlKey === true && e.keyCode === 13 || e.keyCode === 10) {
                        //ctrl+enter 换行
                    }
                }
            })
        }
    }
}]);

conversationDire.directive("emoji", [function() {
    return {
        restrict: "E",
        scope: {
            item: "=",
            content: "="
        },
        template: '<div style="display:inline-block"></div>',
        replace: true,
        link: function(scope: any, ele: angular.IRootElementService, attr: angular.IAttributes) {

            ele.append(scope.item);
            ele.on("click", function() {
                scope.$parent.currentConversation.draftMsg = scope.$parent.currentConversation.draftMsg.replace(/\n$/, "");
                scope.$parent.currentConversation.draftMsg = scope.$parent.currentConversation.draftMsg + scope.item.children[0].getAttribute("name");
                scope.$parent.$apply();
                var obj = document.getElementById("message-content");
                webimutil.Helper.getFocus(obj);
            })

            if(webimutil.Helper.os.mac){
               if(webimutil.Helper.browser.safari){
                 angular.element(ele[0]).css("padding-top", "5px");
               }
            }
            else{
               angular.element(ele[0]).css("padding-bottom", "5px");
               angular.element(ele[0]).css("padding-right", "4px");
            }
        }
    }
}]);

conversationDire.directive("voiceMessage", ["$timeout", function($timeout: angular.ITimeoutService) {
    return {
        restrict: "E",
        scope: { item: "=" },
        template: '<div class="">' +
        '<div class="Message-audio">' +
        '<span class="Message-entry" style="">' +
        // '<span class="audioBox clearfix " ng-class="{\'animate\':isplaying}" ng-click="play()"><i></i><i></i><i></i></span>'+
        '<span class="audioBox clearfix"  ng-class="{\'animate\':isplaying}" ng-click="play()"><i></i><i></i><i></i><i></i></span>' +
        '<span class="audioTimer">{{item.duration}}”</span><span class="audioState" ng-show="item.isUnReade"></span>' +
        '</span>' +
        '</div>' +
        '</div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
            scope.item.duration = parseInt(scope.item.duration || scope.item.content.length / 1024);
            RongIMLib.RongIMVoice.preLoaded(scope.item.content);
            scope.play = function() {
                RongIMLib.RongIMVoice.stop();
                if (!scope.isplaying) {
                    scope.item.isUnReade = false;
                    RongIMLib.RongIMVoice.play(scope.item.content, scope.item.duration);
                    scope.isplaying = true;
                    if (scope.timeoutid) {
                        $timeout.cancel(scope.timeoutid);
                    }
                    scope.timeoutid = $timeout(function() {
                        scope.isplaying = false;
                    }, scope.item.duration * 1000);
                } else {
                    scope.isplaying = false;
                    $timeout.cancel(scope.timeoutid);
                }
            }

        }
    }
}]);

// conversationDire.directive("unknownMessage", [function () {
//         return {
//             restrict: "E",
//             scope: {
//                 item: "="
//             },
//             template: '<div class="Messages-getHistory"><b>{{item.content}}</b></div>',
//             replace: true,
//             link: function(scope: any, ele: angular.IRootElementService, attr: any) {
//             }
//         };
//     }]);

conversationDire.directive("textMessage", [function() {
    return {
        restrict: "E",
        scope: {
            item: "="
        },
        template: '<div class="" id="{{itemid}}">' +
        '<div class="Message-text">' +
        '<pre class="at_all_people" ng-show="isAtAll">@所有人</pre>' +
        '<pre class="Message-entry" ng-bind-html="content|trustHtml">' +
        // '<i class="at_function" ng-show="isAtPart">@****</i>' +
        '</pre>' +
        '<br></span></div>' +
        '</div>',
        replace: true,
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
            var EMailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/gi
            var EMailArr = <string[]>[];
            scope.isAtAll = false;
            scope.isAtPart = false;
            if(scope.$parent.item.mentionedInfo && scope.$parent.item.mentionedInfo.type == webimmodel.AtTarget.All){
              scope.isAtAll = true;
            }
            if(scope.$parent.item.mentionedInfo && scope.$parent.item.mentionedInfo.type == webimmodel.AtTarget.Part){
              scope.isAtPart = true;
            }
            scope.itemid = scope.$parent.item.messageUId;
            scope.content = scope.item.content.replace(EMailReg, function(str: any) {
                EMailArr.push(str);
                return '[email`' + (EMailArr.length - 1) + ']';
            });

            var URLReg = /(((ht|f)tp(s?))\:\/\/)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|cn|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk|me|im))(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*/gi

            scope.content = scope.content.replace(URLReg, function(str: any, $1: any) {
                if ($1) {
                    return '<a target="_blank" href="' + str + '">' + str + '</a>';
                } else {
                    return '<a target="_blank" href="//' + str + '">' + str + '</a>';
                }
            });

            for (var i = 0, len = EMailArr.length; i < len; i++) {
                scope.content = scope.content.replace('[email`' + i + ']', '<a href="mailto:' + EMailArr[i] + '">' + EMailArr[i] + '<a>');
            }
            // TODO 匹配 @ 信息显示消息内容
        }
    }
}])

conversationDire.directive("imageMessage", [function() {
    return {
        restrict: "E",
        scope: { item: "=" },
        template: '<div class="">' +
        '<div class="Message-img">' +
        '<span id="{{\'rebox_\'+$id}}" ng-click="showBigImage()"   class="Message-entry gallery" style="">' +
        '<!-- <p>发给您一张示意图</p> -->' +
        // '<img ng-src="{{item.content||\'../../static/images/barBg.png\'}}" data-image="{{item.imageUri}}" alt=""/>' +
        '<a href="{{item.imageUri||\'../../static/images/barBg.png\'}}"><img ng-src="{{item.content||\'../../static/images/barBg.png\'}}"  data-image="{{item.imageUri}}" alt=""/></a>' +
        '</span>' +
        '</div>' +
        '</div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
            var img = new Image();
            img.src = scope.item.imageUri;
            setTimeout(function() {
                $('#rebox_' + scope.$id).rebox({ selector: 'a' }).bind("rebox:open", function() {
                    //jQuery rebox 点击空白关闭
                    var rebox = <any>document.getElementsByClassName("rebox")[0];
                    rebox.onclick = function(e: any) {
                        if (e.target.tagName.toLowerCase() != "img") {
                            var rebox_close = <any>document.getElementsByClassName("rebox-close")[0];
                            rebox_close.click();
                            rebox = null; rebox_close = null;
                        }
                    }
                });
            })



            img.onload = function() {

                scope.$apply(function() {
                    scope.item.content = scope.item.imageUri
                });
            }
            scope.showBigImage = function() {

            }
        }
    }
}])

conversationDire.directive("bigImage", [function() {
    return {
        restrict: "E",
        scope: { show: "=", imagesrc: "=" },
        template: '<div class="bigimage-background">' +
        '<div class="bigimage">' +
        '<img src="imagesrc"></img>' +
        '</div>' +
        '</div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {

        }
    }
}]);

conversationDire.directive("richContentMessage", [function() {
    return {
        restrict: "E",
        scope: {
            item: "="
        },
        template: '   <div class="" >' +
        '<div class="Message-image-text">' +
        '<span class="Message-entry" style="">' +
        '<div class="image-textBox">' +
        '<h4>{{item.title}}</h4>' +
        '<div class="cont clearfix">' +
        '<img ng-src="{{item.imageUri||\'../../static/images/barBg.png\'}}" alt=""/>' +
        '<div>{{item.content}}</div>' +
        '</div>' +
        '</div>' +
        '</span>' +
        '</div>' +
        '</div>'
    }
}]);

conversationDire.directive("locationMessage", [function() {
    return {
        restrict: "E",
        scope: {
            item: "="
        },
        template: ' <div class="">' +
        '<div class="Message-map">' +
        '<span class="Message-entry" style="">' +
        '<div class="mapBox">' +
        '<img ng-src="{{item.content||\'../../static/images/barBg.png\'}}" alt=""/>' +
        '<span>{{item.poi}}</span>' +
        '</div>' +
        '</span>' +
        '</div>' +
        '</div>'
    }
}])

conversationDire.directive("fileMessage", [function() {
    return {
        restrict: "E",
        scope: { item: "=" },
        template: '<div class="" id="{{itemid}}">' +
        '<div class="upload_file">' +
         '<div class="out_border">' +
            '<div class="file_type fl">' +
              '<img ng-src="{{imgType}}">' +
            '</div>' +
            '<div class="file_name fl">' +
              '<p class="p1">{{item.name}}</p>' +
              '<p class="p2">{{showSize}}</p>' +
              '<div class="up_process"><div></div></div>' +
            '</div>' +
            '<div ng-show="isover"  class="file_btn fr" ng-click="Download()">' +
            '</div>' +
            '<div ng-show="isuploading" class="file_btn_close fr" ng-click="Cancel()">' +
            '</div>' +
         '</div>' +
        '</div>' +
        '</div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
            var imgType = 'undefined', showSize = '';
            scope.itemid = scope.$parent.item.messageUId;
            scope.Cancel =  function(){
              scope.item.state = 1;
            }
            scope.Download =  function(){
              window.open(scope.item.uri, '_self');
            }
            function fomate(num: number){
              var result = Math.ceil(num * 100);
              return result / 100;
            }
            switch(scope.item.type){
              case 'doc':
              case 'mp3':
              case 'mp4':
              case 'txt':
              case 'xlsx':
                 imgType = scope.item.type;
                 break;
              case 'docx':
                 imgType = 'doc';
                 break;
            }
            imgType = 'assets/img/' + scope.imgType + '.png';
            scope.imgType = imgType;

            updateState();
            function updateState(){
              scope.isover = scope.item.state == webimmodel.FileState.Success, scope.isuploading = scope.item.state == webimmodel.FileState.Uploading || scope.item.state == -1;
              switch (scope.item.state) {
                case webimmodel.FileState.Canceled:
                  showSize = '已取消';
                  angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'none');
                  break;
                case webimmodel.FileState.Failed:
                  showSize = '上传失败';
                  angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'none');
                  break;
                case -1:
                case webimmodel.FileState.Uploading:
                  showSize = scope.item.size >= 1024 ? fomate(scope.item.size / 1024) + 'M' : fomate(scope.item.size) + 'K';
                  angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'block');
                  angular.element(ele[0].getElementsByClassName("up_process")[0].children[0]).css('width', scope.item.extra);
                  break;
                case webimmodel.FileState.Success:
                  showSize = scope.item.size >= 1024 ? fomate(scope.item.size / 1024) + 'M' : fomate(scope.item.size) + 'K';
                  angular.element(ele[0].getElementsByClassName("up_process")[0].children[0]).css('width', '100%');
                  angular.element(ele[0].getElementsByClassName("up_process")[0]).css('display', 'none');
                  if(typeof unbingWatch === 'function' || typeof unbingWatch === "object"){
                    unbingWatch();
                  }
                  break;
              }
              scope.showSize = showSize;
            }

            var unbingWatch = scope.$watch("item.state", function(newVal: any, oldVal: any) {
              if (newVal === oldVal)
                  return;
              updateState();
            });
        }
    }
}])

conversationDire.directive("dateMessage", [function() {
    return {
        restrict: "E",
        scope: { date: "=" },
        template: '<div class="Messages-date"><b style="cursor: default;">{{date|historyTime}}</b></div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
        }
    }
}]);
conversationDire.directive("getHistoryMessage", [function() {
    return {
        restrict: "E",
        scope: { myclick: "&" },
        template: '<div class="Messages-getHistory"><b ng-click="myclick()" class="" style="cursor: pointer;">查看历史消息</b></div>',
        link: function(scope: any, ele: angular.IRootElementService, attr: any) {
        }
    }
}]);
conversationDire.directive("getMoreMessage", [function() {
    return {
        restrict: "E",
        scope: { myclick: "&" },
        template: '<div class="Messages-getHistory"><b ng-click="myclick()" class="" style="cursor: pointer;">获取更多历史消息</b></div>'
    }
}]);
