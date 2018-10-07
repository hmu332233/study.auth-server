## study.auth-server
auth 기능이 있는 api server 공부

### apis
- (POST) api/auth/login
- (GET) api/auth/me
- (GET) api/auth/refresh
- (GET) api/users
- (GET) api/users/{username}
- (POST) api/users
- (PUT) api/users/{username}
- (DELETE) api/users/{username}


### env
- MONGO_DB: mongodb url
- JWT_SECRET: token의 secretkey로 쓸 문자열


### 참고사이트
- [JWT-JSON-Web-Token-로-로그인-REST-API-만들기](https://www.a-mean-blog.com/ko/blog/Node-JS-API/_/JWT-JSON-Web-Token-%EB%A1%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-REST-API-%EB%A7%8C%EB%93%A4%EA%B8%B0)
- [mongodb hosting](https://mlab.com)