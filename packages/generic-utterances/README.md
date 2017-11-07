## assistant-generic-utterances
This [AssistantJS][1] component automatically generates utterances in English and German for generic intents. This is useful if one of your platforms (like api.ai or google assistant) does not support generic intents on it's own. Just install it with `npm install assistant-generic-utterances --save` and add it as an dependency to your `index.ts`:
```typescript
import { descriptor as genericUtterancesDescriptor } from "assistant-generic-utterances";

/** and below, in your "initializeSetups" method: */
assistantJs.registerComponent(genericUtterancesDescriptor);
```
After that, ``assistant-generic-utterances`` injects itself automatically into your generator workflow. 

[1]: http://assistantjs.org