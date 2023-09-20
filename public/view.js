(function() {
    "use strict";

    // var	$body = document.querySelector('body');

	// Methods/polyfills.

		// classList | (c) @remy | github.com/remy/polyfills | rem.mit-license.org
			!function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}function n(t,n,i){Object.defineProperty?Object.defineProperty(t,n,{get:i}):t.__defineGetter__(n,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,e=i.push,s=i.splice,o=i.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();

		// canUse
			window.canUse=function(p){if(!window._canUse)window._canUse=document.createElement("div");var e=window._canUse.style,up=p.charAt(0).toUpperCase()+p.slice(1);return p in e||"Moz"+up in e||"Webkit"+up in e||"O"+up in e||"ms"+up in e};

		// window.addEventListener
			(function(){if("addEventListener"in window)return;window.addEventListener=function(type,f){window.attachEvent("on"+type,f)}})();

    (function() {

        // Vars.
            var $form = document.getElementById('saveForm');
            var $submit = document.getElementById('save');
            var $load = document.getElementById('load');
            var $message, $loadGIF;

        // Bail if addEventListener isn't supported.
            if (!('addEventListener' in $form))
                return;

        // Message.
            $message = document.createElement('span');
                $message.classList.add('message');
                $form.appendChild($message);

            $message._show = function(type, text) {

                $message.innerHTML = text;
                $message.classList.add(type);
                $message.classList.add('visible');

                window.setTimeout(function() {
                    $message._hide(type);
                }, 3000);

            };

            $message._showNoHide = function(type, text) {

                $message.innerHTML = text;
                $message.classList.add(type);
                $message.classList.add('visible');

                if(type === 'loading') {
                    $loadGIF = document.createElement('img');
                    $loadGIF.setAttribute('src', '/images/Double Ring-1s-200px.gif');
                    $loadGIF.setAttribute('width', '50rem');
                    $loadGIF.setAttribute('height', '50rem');
                    $loadGIF.setAttribute('style', 'padding:0.3em 0 0; position: absolute;');
                    $form.appendChild($loadGIF);
                }

            };

            $message._hide = function(type) {
                $message.classList.remove('visible');

                if(type){
                    if(type === 'loading') {
                        $form.removeChild($loadGIF)
                        $message.classList.remove(type);
                    } else {
                        window.setTimeout(function() {
                            $message.classList.remove(type);
                        }, 300);
                    }
                    $message.innerHTML = null;
                }

            };
        // Events.
        // Note: If you're *not* using AJAX, get rid of this event listener.
            $submit.addEventListener('click', function(event) {

                event.stopPropagation();
                event.preventDefault();

                // Hide message.
                    $message._hide('');

                // Disable submit.
                    $submit.disabled = true;

                // AJAX Request.
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/save', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {

                            // Reset form.
                            $form.reset();

                            // Enable submit.
                            $submit.disabled = false;

                            // Show message based on the response.
                            if (xhr.status === 200) {
                                // Hide message.
                                $message._hide('loading');

                                $message._show('success', 'Thank you!');
                            } else {
                                // Hide message.
                                $message._hide('loading');

                                $message._show('failure', 'Something went wrong. Please try again.');
                            }
                        }
                    };

                    var $name = document.getElementById('saveName');

                    if($name.value){
                        $message._showNoHide('loading', 'Loading');
                        xhr.send(JSON.stringify({ name: $name.value }));
                    } else {
                        // Reset form.
                        $form.reset();

                        // Enable submit.
                        $submit.disabled = false;
                        $message._show('failure', 'Invalid Input');

                    }

            });

    $load.addEventListener('click', function(event) {

        event.stopPropagation();
        event.preventDefault();

        // Hide message.
            $message._hide('');

        // Disable submit.
            $submit.disabled = true;

        // AJAX Request.
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/load', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {

                    // Reset form.
                    $form.reset();

                    // Enable submit.
                    $submit.disabled = false;

                    // Show message based on the response.
                    if (xhr.status === 200) {
                        // Hide message.
                        $message._hide('loading');

                        $message._show('success', 'Thank you!');

                        window.location.href;
                    } else {
                        // Hide message.
                        $message._hide('loading');

                        $message._show('failure', 'Something went wrong. Please try again.');
                    }
                }
            };

            var $name = document.getElementById('saveName');

            if($name.value){
                $message._showNoHide('loading', 'Loading');
                xhr.send(JSON.stringify({ name: $name.value }));
            } else {
                // Reset form.
                $form.reset();

                // Enable submit.
                $submit.disabled = false;
                $message._show('failure', 'Invalid Input');

            }

    });

})();

})();