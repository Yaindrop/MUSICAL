/* global $ajax*/
/* jshint browser: true */

document.addEventListener("DOMContentLoaded", function (event) {
    var socket = io('http://localhost:3000');
    socket.on("connected", function (msgObj) {
        console.log("Socket - Connected");
        notify("成功与超宇宙建立连接", "mediumseagreen");
        logoutbtn.click();
        exitbtn.click();
    });
    socket.on("msg", function (msgObj) {
        console.log("Socket - Received: " + JSON.stringify(msgObj));
        handle(msgObj);
    });

    var delay = 0;
    checkDelay();
    function checkDelay () {
        send({
            type: "checkdelay",
        });
        delay = new Date().getTime();
    }

    var msgFlow = [];
    var checkingId, checkingPass, id, checkingUni, universe, unikey, testcode, validKey;
    var register = false;

    var title       = document.getElementById("title");
    var leftmenu    = document.getElementById("leftmenu");
    var rightmenu   = document.getElementById("rightmenu");
    var leftmenu2   = document.getElementById("leftmenu2");
    var rightmenu2  = document.getElementById("rightmenu2");
    var idinput     = document.getElementById("idinput");
    var passinput   = document.getElementById("passinput");
    var loginbtn    = document.getElementById("loginbtn");
    var uniinput    = document.getElementById("uniinput");
    var unikeyinput = document.getElementById("unikeyinput");
    var unibtn      = document.getElementById("unibtn");
    var loggedid    = document.getElementById("loggedid");
    var avatar      = document.getElementById("avatar");
    var cgavtbtn    = document.getElementById("cgavtbtn");
    var cgpassinput = document.getElementById("cgpassinput");
    var cgpassbtn   = document.getElementById("cgpassbtn");
    var whkeyinput  = document.getElementById("whkeyinput");
    var enterwhbtn  = document.getElementById("enterwhbtn");
    var createwhbtn = document.getElementById("createwhbtn");
    var logoutbtn   = document.getElementById("logoutbtn");
    var currentuni  = document.getElementById("currentuni");
    var cgkeyinput  = document.getElementById("cgkeyinput");
    var cgkeybtn    = document.getElementById("cgkeybtn");
    var userlist    = document.getElementById("userlist");
    var exitbtn     = document.getElementById("exitbtn");

    var catcher     = document.getElementById("catcher");
    var msgarea     = document.getElementById("msgarea");
    var uppicbtn    = document.getElementById("uppicbtn");
    var uppicinput  = document.getElementById("uppicinput");
    var postbtn     = document.getElementById("postbtn");

    var idreg = /(^[0-9a-zA-Z]{4,12}$)|(^[\u4e00-\u9fa5]{2,8}$)/;
    var passreg = /^[0-9a-zA-Z]{6,12}$/;
    var unireg = /^[a-zA-Z0-9]{10}$/;

    title.addEventListener("click", function () {
        if (document.body.clientWidth < 800) {
            if (leftmenu.classList.contains("top") && rightmenu.classList.contains("top")) {
                leftmenu.classList.remove("top");
                leftmenu2.classList.remove("top");
            } else if (!leftmenu.classList.contains("top")){
                leftmenu.classList.add("top");
                leftmenu2.classList.add("top");
                rightmenu.classList.remove("top");
                rightmenu2.classList.remove("top");
            } else if (!rightmenu.classList.contains("top")) {
                rightmenu.classList.add("top");
                rightmenu2.classList.add("top");
            }
        }
    });
    window.addEventListener("resize", onresize);
    onresize();
    function onresize () {
        console.log(document.body.clientWidth);
        if (document.body.clientWidth < 800) {
            leftmenu.classList.add("top");
            leftmenu2.classList.add("top");
            rightmenu.classList.add("top");
            rightmenu2.classList.add("top");
            title.classList.add("noselect");
        } else {
            leftmenu.classList.remove("top");
            leftmenu2.classList.remove("top");
            rightmenu.classList.remove("top");
            rightmenu2.classList.remove("top");
            title.classList.remove("noselect");
        }
    }

    notify("version 0.0.1 Alpha, powered by node.js & socket.io, made by Yaindrop", "lightgray");
    if (document.body.clientWidth < 800) {
        notify("小屏幕用户请点击上方标题, 在弹出的菜单中操作.");
    }
    notify("欢迎来到 Multi-Universal Synchronized Information Catcher And Liberator, MUSICAL, 多宇宙同步信息捕捉与释放器.", "papayawhip");
    notify("在这里你可以在各个宇宙中安全地传递, 接受信息.<br> <span id='welcomeinfo' style='color: coral'>点击我获取关于 MUSICAL 的更多介绍</span>", "papayawhip");
    document.getElementById("welcomeinfo").addEventListener("click", function () {
        notify("MUSICAL 直接连接到包涵所有宇宙的超宇宙, 请向超宇宙注册/登录你的 MUSICAL 账户，并提供正确的 Universe ID 来接入子宇宙.", "papayawhip");
        notify("你提供的 MUSICAL ID 和 Password 将在本地被转换成 SHA256 值后发送给超宇宙, 并均以 SHA256 值的形式被保存. SHA256 是一种摘要算法, 不能够被反向解析, 即超宇宙也无法知道你确切的 MUSICAL ID 和 Password.", "lightgray");
        notify("你将实时接收到你所处宇宙的全部信息, 但他们是经过了 AES256 加密的. 你需要提供正确的 Universe Key (由宇宙管理员设置) 作为秘钥才能解析它们的内容.", "lightgray");
    });
    notify("请在左侧菜单中登录/注册你的 MUSICAL ID.", "papayawhip");
    notify("MUSICAL ID 格式为: 4-12位数字字母组合(区分大小写)<span style='color: seagreen'>或</span> 3-8位纯汉字字符", "papayawhip");
    notify("Password 格式为: 6-12位数字字母组合(区分大小写)", "papayawhip");

    loginbtn.addEventListener("click", function () {
        if (register) {
            if (passinput.value === checkingPass) {
                notify("已发送注册请求", "papayawhip");
                passinput.disabled = true;
                send ({
                    type: "register",
                    id: getSHA256(checkingId),
                    pass: getSHA256(checkingPass)
                });
            } else {
                passinput.value = "";
                notify("与上次输入密码不符");
            }
            return;
        } else if (checkingId || checkingPass) {
            notify("超宇宙正在处理上次身份验证请求，请稍候.");
            return;
        }
        if (idinput.value.match(idreg)) {
            if (passinput.value.match(passreg)) {
                checkingId = idinput.value;
                checkingPass = passinput.value;
                idinput.disabled = true;
                passinput.disabled = true;
                send ({
                    type: "checkid",
                    id: getSHA256(checkingId)
                });
                notify("身份信息格式无误, 已向超宇宙发送验证请求.", "mediumseagreen");
            } else {
                console.log(getSHA256(idinput.value));
                notify("Password 格式有误，应为: 6-12位数字字母组合(区分大小写)");
            }
        } else {
            notify("MUSICAL ID 格式有误，应为: 4-12位数字字母组合(区分大小写)<span style='color: seagreen'>或</span> 2-8位纯汉字字符");
        }
    });
    cgavtbtn.addEventListener("click", function () {

    });
    cgpassbtn.addEventListener("click", function () {

    });
    enterwhbtn.addEventListener("click", function () {

    });
    createwhbtn.addEventListener("click", function () {

    });
    logoutbtn.addEventListener("click", function () {
        exitbtn.click();
        if (id) {
            notify("已登出 " + id , "papayawhip");
            id = null;
            send ({
                type: "logout",
            });
            loggedid.value = "";
            idinput.disabled = false;
            passinput.disabled = false;
            uniinput.disabled = true;
            unikeyinput.disabled = true;
            leftmenu.classList.remove("left");
            leftmenu2.classList.add("left");
        }
    });
    unibtn.addEventListener("click", function () {
        if (checkingUni) {
            notify("超宇宙正在处理上次宇宙接入请求，请稍候.");
            return;
        }
        if (id) {
            if (uniinput.value.match(unireg)) {
                if (unikeyinput.value) {
                    checkingUni = uniinput.value;
                    notify("已向超宇宙申请接入宇宙 " +  checkingUni, "papayawhip");
                    send ({
                        type: "universe",
                        id: getSHA256(checkingUni)
                    });
                    uniinput.disabled = true;
                    unikeyinput.disabled = true;
                } else {
                    notify("请输入 Universe Key");
                }
            } else {
                notify("Universe ID 格式有误, 应为: 10位数字字母组合(区分大小写)");
            }
        } else {
            notify("请先登录/注册你的 MUSICAL ID");
        }
    });
    cgkeybtn.addEventListener("click", function () {
        if (universe) {
            if (cgkeyinput.value) {
                unikey = cgkeyinput.value;
                validKey = false;
                if (decryptAES(testcode, unikey) === "TESTCODE") {
                    notify("Universe Key 已通过验证", "mediumseagreen");
                    validKey = true;
                } else {
                    notify("Universe Key 未通过验证, 请输入正确的 Universe Key.");
                }
                cgkeyinput.value = "";
            } else {
                notify("请输入新 Universe Key");
            }
        }
    });
    exitbtn.addEventListener("click", function () {
        if (universe) {
            notify("已离开 " + universe + " 宇宙" , "papayawhip");
            universe = null;
            testcode = null;
            send ({
                type: "exituni",
            });
            currentuni.value = "";
            cgkeyinput.value = "";
            cgkeyinput.disabled = true;
            uniinput.disabled = false;
            unikeyinput.disabled = false;
            rightmenu.classList.remove("right");
            rightmenu2.classList.add("right");
        }
    });
    uppicbtn.addEventListener("click", function () {
        if (id) {
            if (universe) {
                if (validKey) {
                    uppicinput.click();
                } else {
                    notify("请先输入正确的 Universe Key");
                }
            } else {
                notify("请先进入一个宇宙");
            }
        } else {
            notify("请先登录/注册你的 MUSICAL ID");
        }
    });
    uppicinput.addEventListener("change", function () {
        var image = new Image(),
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext('2d');

        var file = uppicinput.files[0];
        r = new FileReader();
        r.onload = function(){
            console.log(r.result);
        };
        r.readAsDataURL(file);
        post(id, JSON.stringify(uppicinput.files[0]));
    });
    postbtn.addEventListener("click", function () {
        if (id) {
            if (universe) {
                if (validKey) {
                    if (msgarea.value) {
                        send({
                            type: "post",
                            id: encryptAES(id, unikey),
                            content: encryptAES(msgarea.value, unikey)
                        });
                    }
                    msgarea.value = "";
                } else {
                    notify("请先输入正确的 Universe Key");
                }
            } else {
                notify("请先进入一个宇宙");
            }
        } else {
            notify("请先登录/注册你的 MUSICAL ID");
        }
    });



    function notify (content, bgc, color) {
        var note = document.createElement("div");
        note.classList.add("note");
        note.innerHTML = content;
        note.time = (new Date()).getTime();
        if (bgc) note.style.backgroundColor = bgc;
        if (color) note.style.color = color;
        msgFlow.push(note);
        refreshCatcher();
    }
    function post (postid, postcontent, color) {
        var postdiv = document.createElement("div");
        postdiv.classList.add("postdiv");
        var postiddiv = document.createElement("div");
        postiddiv.classList.add("postiddiv");
        postiddiv.innerHTML = postid;
        var postcontentdiv = document.createElement("div");
        postcontentdiv.classList.add("postcontentdiv");
        postcontentdiv.innerHTML = postcontent;
        if (color) postcontentdiv.style.color = color;
        if (postid === id) {
            postdiv.classList.add("mypostdiv");
            postdiv.appendChild(postcontentdiv);
            postdiv.appendChild(postiddiv);
        } else {
            postdiv.appendChild(postiddiv);
            postdiv.appendChild(postcontentdiv);
        }
        msgFlow.push(postdiv);
        refreshCatcher();
    }
    function refreshCatcher () {
        catcher.innerHTML = "";
        var pt = 0;
        for (var i = 0; i < msgFlow.length; i ++) {
            if (msgFlow[i].time - pt >= 60000) {
                var dateObj = new Date();
                dateObj.setTime(msgFlow[i].time);
                var timetag = document.createElement("div");
                timetag.classList.add("time");
                timetag.innerHTML = dateObj.toLocaleString();
                catcher.appendChild(timetag);
                pt = msgFlow[i].time;
            }
            catcher.appendChild(msgFlow[i]);
            if (i === msgFlow.length - 1) {
                msgFlow[i].scrollIntoView();
            }
        }
    }
    function send (msgObj) {
        socket.emit("msg", msgObj);
        console.log("Socket - Sent: " + JSON.stringify(msgObj));
    }
    function handle (msgObj) {
        switch (msgObj.type) {
            case "reply":
                switch (msgObj.reply) {
                    case "checkid":
                        if (msgObj.exists) {
                            notify("已在超宇宙中找到 " + checkingId + " 的记录, 正在尝试登录.", "mediumseagreen");
                            send ({
                                type: "login",
                                id: getSHA256(checkingId),
                                pass: getSHA256(checkingPass)
                            });
                        } else {
                            notify("未在超宇宙中找到 " + checkingId + " 的记录, 请再次输入密码以注册该身份.", "papayawhip");
                            register = true;
                            passinput.disabled = false;
                            passinput.value = "";
                            loginbtn.innerHTML = "&nbsp;Register=>&nbsp;";
                        }
                        break;
                    case "login":
                        if (msgObj.accepted) {
                            notify("成功以 " + checkingId + " 身份登录, 欢迎.", "mediumseagreen");
                            notify("你现在可以在右侧菜单接入子宇宙, Universe ID 格式为: " + "10位数字字母组合(区分大小写)", "papayawhip");
                            notify("你需要在线下与宇宙管理员联系. 在获得 Universe Key, 并使你的 MUSICAL ID 被加入到其宇宙的居民列表中后, 你方可开始在宇宙中接收/发送信息", "papayawhip");
                            notify("注意: 对 Universe Key 的严格保密是宇宙中安全通信得以建立的基础, 也是每一个宇宙居民的基本义务. Universe Key 不应被长期储存在任何与互联网连接的电子设备中, 而应被纸笔记录并良好保存, 或者, 在最好的情况下, 只被牢记在脑中.", "papayawhip", "red");
                            proceedLogin();
                        } else {
                            notify("无法以 " + checkingId + " 身份登录, Password 不符.");
                            checkingId = null;
                            checkingPass = null;

                            passinput.value = "";
                            passinput.disabled = false;
                        }
                        break;
                    case "register":
                        register = false;
                        loginbtn.innerHTML = "&nbsp;Continue=>&nbsp;";
                        notify("成功以 " + checkingId + " 身份注册并登录, 欢迎.", "mediumseagreen");
                        proceedLogin();
                        break;
                    case "universe":
                        if (msgObj.exists) {
                            if (msgObj.accepted) {
                                notify("成功以 " + id + " 身份接入 " + checkingUni + " 宇宙.", "mediumseagreen");
                                universe = checkingUni;
                                checkingUni = null;
                                unikey = unikeyinput.value;
                                uniinput.value = "";
                                unikeyinput.value = "";
                                currentuni.value = universe;
                                cgkeyinput.disabled = false;
                                rightmenu.classList.add("right");
                                rightmenu2.classList.remove("right");

                                testcode = msgObj.testcode;
                                validKey = false;
                                if (decryptAES(testcode, unikey) === "TESTCODE") {
                                    notify("Universe Key 已通过验证", "mediumseagreen");
                                    validKey = true;
                                } else {
                                    notify("Universe Key 未通过验证, 请输入正确的 Universe Key.");
                                }
                            } else {
                                notify("无法以 " + id + " 身份接入 " + checkingUni + " 宇宙, 你尚未取得此宇宙的居民权, 请联系此宇宙的管理员.");
                                checkingUni = null;
                                uniinput.disabled = false;
                                unikeyinput.disabled = false;
                            }
                        } else {
                            notify("超宇宙中无法找到 " + checkingUni + " 宇宙");
                            checkingUni = null;
                            uniinput.disabled = false;
                            unikeyinput.disabled = false;
                        }
                        break;
                    case "checkdelay":
                        delay = (new Date().getTime() - delay) + "ms";
                        console.log("Socket - Delay: " + delay);
                        delay = 0;
                        setTimeout(function () {
                            checkDelay();
                        }, 5000);
                        break;
                }
                break;
            case "post":
                if (validKey) {
                    console.log("here");
                    post(decryptAES(msgObj.id, unikey), decryptAES(msgObj.content, unikey));
                }
                break;

            function proceedLogin () {
                id = checkingId;
                checkingId = null;
                checkingPass = null;
                passinput.value = "";
                leftmenu.classList.add("left");
                leftmenu2.classList.remove("left");
                loggedid.value = id;
                uniinput.disabled = false;
                unikeyinput.disabled = false;
            }
        }
    }
    function getSHA256 (input) {
        var text = input;
        for (var i = 0; i < 9; i ++) {
            text = CryptoJS.SHA256(text).toString();
        }
        return text;
    }
    function encryptAES (text, key) {
        return CryptoJS.AES.encrypt(text, key) + "";
    }
    function decryptAES (text, key) {
        return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
    }

});
