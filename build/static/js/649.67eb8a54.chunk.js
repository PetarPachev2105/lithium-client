"use strict";(self.webpackChunklithium_client=self.webpackChunklithium_client||[]).push([[649],{7649:function(e,t,n){var r=n(4165),a=n(5861),s=n(7477),c={API_URL:"https://api.lithiumawesome.com/api",WEBSOCKET_URL:"ws://ec2-3-73-50-42.eu-central-1.compute.amazonaws.com"},o=n(2906).default,u=c.API_URL,i=s.ZP.create({timeout:9e5}),p=null,d=null,m=new o({concurrency:1});function f(e,t){var n=t.response&&t.response.data&&t.response.data.message?t.response.data.message:t.toString();self.postMessage({name:"error",payload:{message:"".concat(n)}})}function h(){try{self.postMessage({name:"api-worker-initialized-home",payload:{}})}catch(e){f(0,e)}}function l(){return x.apply(this,arguments)}function x(){return(x=(0,a.Z)((0,r.Z)().mark((function e(){var t;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,s.ZP.get("".concat(u,"/lithiumHood/get_lithium_hood"),{headers:{Token:d}});case 3:t=e.sent,self.postMessage({name:"received-lithium-hood",payload:t.data}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),f(0,e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}function Z(){return v.apply(this,arguments)}function v(){return(v=(0,a.Z)((0,r.Z)().mark((function e(){var t;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,s.ZP.get("".concat(u,"/chatRoom/get_chat_rooms"),{headers:{Token:d}});case 3:t=e.sent,self.postMessage({name:"received-lithium-rooms",payload:t.data}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),f(0,e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}function k(e){return w.apply(this,arguments)}function w(){return(w=(0,a.Z)((0,r.Z)().mark((function e(t){var n;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.post("".concat(u,"/chatRoom/create_group_lithium_room"),{name:t.newLithiumRoomName},{headers:{Token:d,ClientId:p}});case 3:n=e.sent,self.postMessage({name:"created-lithium-room",payload:n.data}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),f(0,e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}function g(){return y.apply(this,arguments)}function y(){return(y=(0,a.Z)((0,r.Z)().mark((function e(){var t;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.get("".concat(u,"/lithiumHoodMember/get_lithium_hood_members"),{headers:{Token:d,ClientId:p}});case 3:t=e.sent,self.postMessage({name:"received-lithium-hood-members",payload:t.data}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),f(0,e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}function b(e){return _.apply(this,arguments)}function _(){return(_=(0,a.Z)((0,r.Z)().mark((function e(t){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.post("".concat(u,"/lithiumHoodRequest/send_hood_request"),{username:t.username},{headers:{Token:d,ClientId:p}});case 3:e.sent,self.postMessage({name:"sent-lithium-hood-request",payload:{username:t.username}}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),f(0,e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}function I(){return R.apply(this,arguments)}function R(){return(R=(0,a.Z)((0,r.Z)().mark((function e(){var t;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.get("".concat(u,"/lithiumHoodRequest/get_hood_requests"),{headers:{Token:d,ClientId:p}});case 3:t=e.sent,self.postMessage({name:"received-lithium-hood-requests",payload:t.data}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),f(0,e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}function M(e){return q.apply(this,arguments)}function q(){return(q=(0,a.Z)((0,r.Z)().mark((function e(t){var n;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.post("".concat(u,"/lithiumHoodRequest/").concat(t.lithiumHoodRequestId,"/accept_hood_request"),{},{headers:{Token:d,ClientId:p}});case 3:n=e.sent,self.postMessage({name:"accepted-lithium-hood-request",payload:n.data}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),f(0,e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}function C(e){return T.apply(this,arguments)}function T(){return(T=(0,a.Z)((0,r.Z)().mark((function e(t){var n;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.post("".concat(u,"/lithiumHoodRequest/").concat(t.lithiumHoodRequestId,"/decline_hood_request"),{},{headers:{Token:d,ClientId:p}});case 3:n=e.sent,self.postMessage({name:"declined-lithium-hood-request",payload:n.data}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),f(0,e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}function H(e){return P.apply(this,arguments)}function P(){return(P=(0,a.Z)((0,r.Z)().mark((function e(t){var n;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i.post("".concat(u,"/lithiumHoodMember/remove_user_from_hood"),{removedUserUsername:t.username},{headers:{Token:d,ClientId:p}});case 3:n=e.sent,self.postMessage({name:"removed-lithium-hood-member",payload:n.data}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),f(0,e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})))).apply(this,arguments)}function U(){try{self.postMessage({name:"api-worker-initialized",payload:{}})}catch(e){f(0,e)}}function L(e){return z.apply(this,arguments)}function z(){return(z=(0,a.Z)((0,r.Z)().mark((function e(t){var n,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=t.chatRoomId,e.next=4,i.get("".concat(u,"/chatRoom/").concat(n,"/enter_chat_room"),{headers:{Token:d,ClientId:p}});case 4:a=e.sent,self.postMessage({name:"messages-loaded",payload:a.data}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),f(0,e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}function A(e){return E.apply(this,arguments)}function E(){return(E=(0,a.Z)((0,r.Z)().mark((function e(t){var n,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=t.chatRoomId,e.next=4,i.post("".concat(u,"/chatRoom/").concat(n,"/send_message"),{content:t.content},{headers:{Token:d,ClientId:p}});case 4:a=e.sent,self.postMessage({name:"message-sent",payload:a.data}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),f(0,e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}function S(e){return B.apply(this,arguments)}function B(){return(B=(0,a.Z)((0,r.Z)().mark((function e(t){var n,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=t.lithiumRoomId,e.next=4,i.post("".concat(u,"/chatRoom/").concat(n,"/add_member"),{username:t.username},{headers:{Token:d,ClientId:p}});case 4:a=e.sent,self.postMessage({name:"added-member",payload:a.data}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),f(0,e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}function K(e){return N.apply(this,arguments)}function N(){return(N=(0,a.Z)((0,r.Z)().mark((function e(t){var n,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=t.lithiumRoomId,e.next=4,i.post("".concat(u,"/chatRoom/").concat(n,"/change_name"),{name:t.name},{headers:{Token:d,ClientId:p}});case 4:a=e.sent,self.postMessage({name:"name-changed",payload:a.data}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),f(0,e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}function O(e){return W.apply(this,arguments)}function W(){return(W=(0,a.Z)((0,r.Z)().mark((function e(t){var n,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=t.lithiumRoomId,e.next=4,i.post("".concat(u,"/chatRoom/").concat(n,"/remove_member"),{username:t.username},{headers:{Token:d,ClientId:p}});case 4:a=e.sent,self.postMessage({name:"member-removed",payload:a.data}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),f(0,e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}function j(e){return D.apply(this,arguments)}function D(){return(D=(0,a.Z)((0,r.Z)().mark((function e(t){var n,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=t.lithiumRoomId,e.next=4,i.post("".concat(u,"/chatRoom/").concat(n,"/change_member_permission"),{username:t.username,permission:t.permission},{headers:{Token:d,ClientId:p}});case 4:a=e.sent,self.postMessage({name:"changed-member-permission",payload:a.data}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),f(0,e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}function F(e){return G.apply(this,arguments)}function G(){return(G=(0,a.Z)((0,r.Z)().mark((function e(t){var n,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n=t.lithiumRoomId,e.next=4,i.get("".concat(u,"/chatRoom/").concat(n,"/").concat(t.message_number,"/load_old_messages"),{headers:{Token:d,ClientId:p}});case 4:a=e.sent,self.postMessage({name:"loaded-old-messages",payload:a.data}),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),f(0,e.t0);case 11:case"end":return e.stop()}}),e,null,[[0,8]])})))).apply(this,arguments)}self.onmessage=function(){var e=(0,a.Z)((0,r.Z)().mark((function e(t){var n,s;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.data.name,s=t.data.payload,"init-home"!==n){e.next=9;break}return p=s.clientId,d=s.token,e.next=7,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h();case 2:case"end":return e.stop()}}),e)}))));case 7:case 12:case 17:case 22:case 27:case 32:case 37:case 42:case 47:case 52:case 59:case 64:case 69:case 74:case 79:case 84:case 89:case 94:e.next=99;break;case 9:if("getting-lithium-hood"!==n){e.next=14;break}return e.next=12,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l();case 2:case"end":return e.stop()}}),e)}))));case 14:if("getting-lithium-rooms"!==n){e.next=19;break}return e.next=17,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Z();case 2:case"end":return e.stop()}}),e)}))));case 19:if("creating-lithium-room"!==n){e.next=24;break}return e.next=22,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,k(s);case 2:case"end":return e.stop()}}),e)}))));case 24:if("getting-lithium-hood-members"!==n){e.next=29;break}return e.next=27,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g();case 2:case"end":return e.stop()}}),e)}))));case 29:if("getting-lithium-hood-requests"!==n){e.next=34;break}return e.next=32,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,I();case 2:case"end":return e.stop()}}),e)}))));case 34:if("sending-lithium-hood-request"!==n){e.next=39;break}return e.next=37,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b(s);case 2:case"end":return e.stop()}}),e)}))));case 39:if("accepting-lithium-hood-request"!==n){e.next=44;break}return e.next=42,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,M(s);case 2:case"end":return e.stop()}}),e)}))));case 44:if("declining-lithium-hood-request"!==n){e.next=49;break}return e.next=47,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,C(s);case 2:case"end":return e.stop()}}),e)}))));case 49:if("removing-lithium-hood-member"!==n){e.next=54;break}return e.next=52,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,H(s);case 2:case"end":return e.stop()}}),e)}))));case 54:if("init"!==n){e.next=61;break}return p=s.clientId,d=s.token,e.next=59,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,U();case 2:case"end":return e.stop()}}),e)}))));case 61:if("load-messages"!==n){e.next=66;break}return e.next=64,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,L(s);case 2:case"end":return e.stop()}}),e)}))));case 66:if("sending-message"!==n){e.next=71;break}return e.next=69,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A(s);case 2:case"end":return e.stop()}}),e)}))));case 71:if("adding-member"!==n){e.next=76;break}return e.next=74,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,S(s);case 2:case"end":return e.stop()}}),e)}))));case 76:if("removing-member"!==n){e.next=81;break}return e.next=79,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,O(s);case 2:case"end":return e.stop()}}),e)}))));case 81:if("changing-name"!==n){e.next=86;break}return e.next=84,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,K(s);case 2:case"end":return e.stop()}}),e)}))));case 86:if("removing-name"!==n){e.next=91;break}return e.next=89,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,O(s);case 2:case"end":return e.stop()}}),e)}))));case 91:if("changing-member-permission"!==n){e.next=96;break}return e.next=94,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,j(s);case 2:case"end":return e.stop()}}),e)}))));case 96:if("loading-old-messages"!==n){e.next=99;break}return e.next=99,m.add((0,a.Z)((0,r.Z)().mark((function e(){return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F(s);case 2:case"end":return e.stop()}}),e)}))));case 99:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}}]);
//# sourceMappingURL=649.67eb8a54.chunk.js.map