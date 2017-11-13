## assistant-google
This package integrates Google Assistant into [AssistantJS][1] via [assistant-apiai][2]. Make sure you have [assistant-apiai][2] set up, install assistant-google  with `npm install assistant-google --save` and add it as an dependency to your `index.ts`:
```typescript
import { descriptor as googleDescriptor } from "assistant-google";

/** and below, in your "initializeSetups" method: */
assistantJs.registerComponent(googleDescriptor);
```
And that's it! Your AssistantJS voice application is now ready for Google Assistant. There is no configuration needed!

#### Debugging OAuth
If you start your AssistantJS server with `FORCED_GOOGLE_OAUTH_TOKEN="mytoken"`, all google assistant requests will return "mytoken" as OAuth token. 
That way, you can test or demo your skill without having a full OAuth setup in place.

[1]: http://assistantjs.org
[2]: https://github.com/webcomputing/assistant-apiai