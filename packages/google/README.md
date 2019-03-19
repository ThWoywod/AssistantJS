## assistant-google
This package integrates Google Assistant into [AssistantJS][1] via [assistant-apiai][2]. Make sure you have [assistant-apiai][2] set up, install assistant-google  with `npm install assistant-google --save` and add it as an dependency to your `index.ts`:
```typescript
import { descriptor as googleDescriptor } from "assistant-google";

/** and below, in your "initializeSetups" method: */
assistantJs.registerComponent(googleDescriptor);
```

After that add the GoogleTypes and the Google-Handler to your handler-config.ts. Replace or remove `ADD_OTHER_TYPES_HERE` and `ADD_OTHER_HANDLER_HERE<CurrentAnswerTypes>` if needed.
```typescript
import { GoogleSpecificTypes, GoogleHandler} from "assistant-google";
import { State } from "assistant-source";

export type MergedAnswerTypes = GoogleSpecificTypes & ADD_OTHER_TYPES_HERE;
export type MergedHandler = GoogleHandler<CurrentAnswerTypes> & ADD_OTHER_HANDLER_HERE<MergedAnswerTypes>;

export type MergedSetupSet = State.SetupSet<MergedAnswerTypes, MergedHandler>
```

And that's it! Your AssistantJS voice application is now ready for Google Assistant. There is no more configuration needed!

#### Debugging OAuth
If you start your AssistantJS server with `FORCED_GOOGLE_OAUTH_TOKEN="mytoken"`, all google assistant requests will return "mytoken" as OAuth token. 
That way, you can test or demo your skill without having a full OAuth setup in place.

[1]: http://assistantjs.org
[2]: https://github.com/webcomputing/assistant-apiai