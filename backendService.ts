import { GenezioDeploy } from "@genezio/types";

@GenezioDeploy()
export class BackendService {
  hello(name: string): string {
    console.log(`Server request receive with parameter ${name}`);
    return `Hello, ${name}!`;
  }
}
