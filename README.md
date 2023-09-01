#모노레포 구성완료
```shell
yarn install

#python 설치 필요
#techdocs local 실행을 위한 준비
pip install mkdocs mkdocs-techdocs-core

cd ./storybook && yarn install

yarn dev
```

## 개발환경설정
- 다음과 같은 토큰이 필요하다

|name|용도|발급방법|
|----|---|-----|
|GITHUB_TOKEN|github repo 접근용|github 설정 -> developer mode에서 발급 후 IDE의 환경변수로 등록|
|AUTH_GITHUB_CLIENT_ID|github oauth 로그인 연동|```b5de16601ef560ba3c87```|
|AUTH_GITHUB_CLIENT_SECRET|github oauth 로그인 연동|shinhancard org maintainer에게 문의|

## software catalog 사용

### 구조

```****
# dev-portal-catalog-template repository
├── react-template
├── springboot-template
    ├── template.yaml # 템플릿 세부 설정
```
현재 템플릿들은 별도의 Repository에서 별도로 관리하고 있으며
[dev-portal-catalog-template](https://github.com/shinhancard/dev-portal-catalog-template
) 에서 확인할 수 있다

```
├── app-config.yaml # catalog url 설정
├── packages
    ├── app > src
        ├── App.tsx # search extension 설정
    ├── backend > src
        ├── providers
            ├── exampleRouter.ts # 예제 backend url 경로
```
템플릿을 추가한 경우에는 app-config.yaml 파일에 경로를 추가해 주어야 한다
