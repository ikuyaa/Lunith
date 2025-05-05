import type { BetterAuthClientPlugin } from "better-auth";
import type { dateOfBirthPlugin} from "./index";

type DateOfBirthPlugin = typeof dateOfBirthPlugin;

export const dateOfBirthClientPlugin = () => ({
    id: "dateOfBirth",
    $InferServerPlugin: {} as ReturnType<DateOfBirthPlugin>
}) satisfies BetterAuthClientPlugin;