# TypeScript Coding Conventions

TypeScript의 [코딩가이드라인](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines)을 준용함.

## Naming

1. 타입 명은 `PascalCase`를 사용 합니다.
1. 인터페이스명 은 `I` 로 시작하지 않도록 작성 합니다.
1. `enum` 값은 `PascalCase`로 작성 합니다.
1. 함수명은 `camelCase`로 작성 합니다.
1. 속성 및 지역변수는 `camelCase`로 작성 합니다.
1. `private properties` 접두사로 `_` 를 사용하지 않습니다.
1. 가능한 한 단어는 자연어 전체를 이용 하도록 합니다.
1. `Generic` 타입 파라미터는 T접두어를 붙여 사용 합니다.(`Request<TBody>`)

## Syntax and Types

1. `null` 대신 `undefined`를 사용 합니다.
1. `for..of` 보다 `.forEach`를 사용 합니다.

## File and Export Structure

1. 공유가 필요한 타입들은 `types.ts`에 정의 합니다..
1. `index.ts` 파일에는 `re-exports` 만 포함 되도록 합니다. 구체적인 구현로직 component 별로 작성 합니다.
1. default export 가 있는 경우 파일명과 맞추도록 하며, export는 파일 마지막에 작성 합니다.
   ```ts
   // ClusterTable.tsx
   type ClusterTableProps = {
     components: ClusterStatus[];
   };
   const ClusterTable = ({ components }: ClusterTableProps) => {
     return (
       <Table columns={columns} options={{ paging: false }} data={components} />
     );
   };
   export default ClusterTable;
   ```

## Error Handling

1. `@backstage/errors` 에 정의된 오류 유형을 우선 사용 합니다.
   ```ts
   throw new NotFoundError(`Could not find resource with id '${id}'`);
   ```
1. 에러 타입은 name으로 체크 합니다.

   ```ts
   if (error.name === 'NotFoundError') {
     // ...
   }
   ```

1. error responses의 `fetch`로의 변환은 `ResponseError` 를 사용 합니다.
   ```ts
   if (!res.ok) {
     throw await ResponseError.fromResponse(res);
   }
   ```

## Eslint and Prettier

1. eslint 및 prettier 설정은 [backstage 설정](https://github.com/spotify/web-scripts/blob/master/packages/prettier-config/index.js) 을 따릅니다.
1. 코드 통일성을 위해 eslint 및 prettier 설정 후 작업 합니다.
   ```json
   {
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode"
   }
   ```

## API Design

1. [SOLID](https://en.wikipedia.org/wiki/SOLID) 원칙을 준수 하도록 노력 합니다.
1. 각 패키지별 최 상위 수준의 exports는 최소화 하도록 설계 하도록 합니다.
1. 구현체를 바로 작성 하기 보다는 interface를 활용 합니다.
1. interface의 구현은 class를 우선 사용하고 기능은 캡슐화 하여 작성 합니다.
1. 구현체의 이름에 구현된 인터페이스의 이름을 붙입니다. 구현 동작을 설명하는 접두사를 사용하거나 `Default` 접두사를 사용합니다.

   ```ts
   interface ImageLoader { ... }

   class DefaultImageLoader implements ImageLoader { /* loads an image */ }
   class CachingImageLoader implements ImageLoader { /* caches loaded images */ }
   class ResizingImageLoader implements ImageLoader { /* resizes loaded images */ }
   ```

1. 생성자는 비공개로 유지하고 인스턴스 생성을 위한 정적 팩터리 메서드를 사용하도록 합니다.

   ```ts
   class DefaultImageLoader implements ImageLoader {
     // 인스턴스 생성은 `create` 로 작성 하도록 합니다.
     static create(options?: ImageLoaderOptions) {
       /* ... */
     }

     // 여러 다른 유형의 인스턴스가 있는 경우 생성 방법을 접미사로 추가합니다.
     static createWithCaching(options?: ImageLoaderOptions) {
       /* ... */
     }

     // 특정 값으로 생성 되는 경우 `from*`을 사용합니다. 추가 옵션이 필요한 경우 두 번째 매개변수를 사용 합니다.
     static fromConfig(config: Config, deps: { logger: Logger }) {
       /* ... */
     }
     static fromUrl(url: URL) {
       /* ... */
     }

     // 비공개 생성자를 테스트에 사용할 수 있도록 하려면 공개 API에 표시되지 않는 `@internal`로 표시된 정적 팩토리를 사용할 수 있습니다.
     /** @internal */
     static forTesting(internalOptions?: { ... }) {
       return new DefaultImageLoader(internalOptions);
     }

     private constructor(/* ... */) {
       /* ... */
     }
   }
   ```

1. 상수 이름은 공통적인 접두사를 사용 합니다.

   ```ts
   // 상수명을 `GITHUB_WIDGET_LABEL`로 작성 하기 보다는 공통된 정보를 접두사로 두어 작성 합니다.
   const WIDGET_LABEL_GITHUB = 'github';
   const WIDGET_LABEL_GITLAB = 'gitlab';
   const WIDGET_LABEL_BITBUCKET = 'bitbucket';
   ```

1. Type과 관련된 추가적인 유형이 필요 할 경우 Type명을 접두어로 사용 합니다.

   ```ts
   // Props의 접두사는 Component명을 사용 하도록 합니다.
   function MyComponent(props: MyComponentProps) {}

   // Option 타입의 경우 operation를 접두어로 사용 합니다.
   function upgradeWidget(options: UpgradeWidgetOptions) {}
   function activateWidget(options: ActivateWidgetOptions) {}

   // 생성을 위한 옵션인 경우 operation을 생략 합니다.
   function createWidget(options: WidgetOptions) {}

   // 아래와 같이 충돌 가능성이 적은 type내의 method 같은 경우 중복부분(ReportsApi) 접두사는 생략 합니다.
   interface ReportsApi {
     uploadReports(request: UploadReportsRequest): Promise<void>;
     deleteReport(request: DeleteReportRequest): Promise<void>;
   }
   ```

1. 함수나 메서드에 인수가 많은 경우 옵션 객체를 생성하여 사용 합니다.

   ```ts
   // Bad
   function createWidget(id: string, name: string, width: number) {}

   // Good
   function createWidget(options: CreateWidgetOptions) {}
   ```

1. 리턴 타입으로 배열 보다는 API 공통 Response Field가 포함된 응답 객체를 사용 하도록 합니다.

   ```ts
   interface UserApi {
     // Bad
     // 배열을 사용할 경우 페이지 정보과 같은 추가 정보 포함하지 않습니다.
     listUsers(): Promise<User[]>;

     // Good
     // 공통 정보를 포함된 응답 객체를 사용합니다.
     listUsers(): Promise<ListUsersResponse>;
   }
   ```

# Documentation Guidelines

Documentation 주석 형식은 `/** ... */` format을 사용 합니다.
`@<tag>` 형식을 사용하여 색인 합니다. 색인 형식은 [TSDoc website](https://tsdoc.org/) 에서 참조 할 수 있습니다.

```ts
/**
 * Properties for {@link ErrorPanel}.
 */
export interface ErrorPanelProps {
  ...
}

/**
 * Renders a warning panel as the effect of an error.
 */
export function ErrorPanel(props: ErrorPanelProps) {
  ...
}
```

## 길이가 긴 Description 을 추가하려면 `@remarks` 태그를 사용합니다.

```ts
/**
 * This function helps you create a thing.
 *
 * @remarks
 *
 * Here is a much longer and more elaborate description of how the
 * creation of a thing works, which is way too long to fit on the index page.
 */
function createTheThing() {}
```

## 매개변수는 `@param` 태그로 문서화 합니다. @param {변수명} - Description 형식으로 작성 합니다

```ts
/**
 * Generates a PluginCacheManager for consumption by plugins.
 *
 * @param pluginId - The plugin that the cache manager should be created for. Plugin names should be unique.
 */
forPlugin(pluginId: string): PluginCacheManager {
  ...
}
```

## 참조가 필요한 경우 `{@link ...}` 태그를 사용 합니다.

```ts
/**
 * {@link ApiRef} for the {@link DiscoveryApi}.
 */
export const discoveryApiRef: ApiRef<DiscoveryApi> = createApiRef(...);
```

# Add Plugin

플러그인 리스트는 [플러그인 마켓플레이스](https://backstage.io/plugins) 에서 확인 합니다.

## 앱에 기존 플러그인 추가

1. 플러그인의 npm 패키지를 리포지토리에 추가합니다.

   ```
   # Backstage 루트 디렉토리에서
   yarn add --cwd packages/app @backstage/plugin-circleci
   ```

2. 앱의 엔터티 페이지에 `EntityCircleCIContent`를 추가합니다.

   ```tsx title="packeage/app/src/components/catalog/EntityPage.tsx"
   /* highlight-add-start */
   import {
     EntityCircleCIContent,
     isCircleCIAvailable,
   } from '@backstage/plugin-circleci';
   /* highlight-add-end */

   const cicdContent = (
     <EntitySwitch>
       {/* ... */}
       {/* highlight-add-next-line */}
       <EntitySwitch.Case if={isCircleCIAvailable}>
         <EntityCircleCIContent />
       </EntitySwitch.Case>
       ;{/* highlight-add-end */}
     </EntitySwitch>
   );
   ```

3. _[선택사항]_ 프록시 구성 추가:

   외부 서비스에서 데이터를 수집하는 플러그인은 프록시 서비스를 사용해야 할 수 있습니다.
   CircleCI 플러그인은 REST API에 액세스하므로 프록시 정의가 필요합니다.

   ```yaml 제목="app-config.yaml"
   proxy:
     '/circleci/api':
       target: https://circleci.com/api/v1.1
       headers:
         Circle-Token: ${CIRCLECI_AUTH_TOKEN}
   ```

### 사이드바에 플러그인 페이지 추가

`packages/app/src/components/Root/Root.tsx`. 파일에 새로운 `SidebarItem` 요소를 추가 합니다.

```tsx title="packages/app/src/components/Root/Root.tsx"
// Import icon from Material UI
import ExtensionIcon from '@material-ui/icons/Extension';

// ... inside the AppSidebar component
<SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />;
```

[Material UI ICON](https://v4.mui.com/components/material-icons/) 에서 지원 되는 아이콘 들을 확인 할 수 있습니다.

모바일 기기에서는 '사이드바'가 화면 하단에 표시됩니다.
