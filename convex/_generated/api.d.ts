/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as account from "../account.js";
import type * as applicants from "../applicants.js";
import type * as applications from "../applications.js";
import type * as assistantQuota from "../assistantQuota.js";
import type * as auth from "../auth.js";
import type * as cases from "../cases.js";
import type * as community from "../community.js";
import type * as crons from "../crons.js";
import type * as dev_seed from "../dev/seed.js";
import type * as documents from "../documents.js";
import type * as home from "../home.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_moderation from "../lib/moderation.js";
import type * as lib_openaiChat from "../lib/openaiChat.js";
import type * as lib_releaseGate from "../lib/releaseGate.js";
import type * as model_applications from "../model/applications.js";
import type * as model_entitlements from "../model/entitlements.js";
import type * as model_ownerData from "../model/ownerData.js";
import type * as moderation from "../moderation.js";
import type * as navigator from "../navigator.js";
import type * as news from "../news.js";
import type * as preferences from "../preferences.js";
import type * as renewals from "../renewals.js";
import type * as shared_applicationShapes from "../shared/applicationShapes.js";
import type * as shared_assistantLimits from "../shared/assistantLimits.js";
import type * as shared_assistantModel from "../shared/assistantModel.js";
import type * as shared_authEmail from "../shared/authEmail.js";
import type * as shared_authOrigins from "../shared/authOrigins.js";
import type * as shared_authSecurity from "../shared/authSecurity.js";
import type * as shared_cases from "../shared/cases.js";
import type * as shared_community from "../shared/community.js";
import type * as shared_documentCompatibility from "../shared/documentCompatibility.js";
import type * as shared_evidenceRequirements from "../shared/evidenceRequirements.js";
import type * as shared_interviewSteps from "../shared/interviewSteps.js";
import type * as shared_interviewValidation from "../shared/interviewValidation.js";
import type * as shared_navigator from "../shared/navigator.js";
import type * as shared_navigatorPrompt from "../shared/navigatorPrompt.js";
import type * as shared_news from "../shared/news.js";
import type * as shared_readiness from "../shared/readiness.js";
import type * as shared_renewals from "../shared/renewals.js";
import type * as shared_reviewModel from "../shared/reviewModel.js";
import type * as shared_screening from "../shared/screening.js";
import type * as shared_socialProviders from "../shared/socialProviders.js";
import type * as shared_tempAccounts from "../shared/tempAccounts.js";
import type * as socialLogin from "../socialLogin.js";
import type * as tempAccounts from "../tempAccounts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  account: typeof account;
  applicants: typeof applicants;
  applications: typeof applications;
  assistantQuota: typeof assistantQuota;
  auth: typeof auth;
  cases: typeof cases;
  community: typeof community;
  crons: typeof crons;
  "dev/seed": typeof dev_seed;
  documents: typeof documents;
  home: typeof home;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  "lib/moderation": typeof lib_moderation;
  "lib/openaiChat": typeof lib_openaiChat;
  "lib/releaseGate": typeof lib_releaseGate;
  "model/applications": typeof model_applications;
  "model/entitlements": typeof model_entitlements;
  "model/ownerData": typeof model_ownerData;
  moderation: typeof moderation;
  navigator: typeof navigator;
  news: typeof news;
  preferences: typeof preferences;
  renewals: typeof renewals;
  "shared/applicationShapes": typeof shared_applicationShapes;
  "shared/assistantLimits": typeof shared_assistantLimits;
  "shared/assistantModel": typeof shared_assistantModel;
  "shared/authEmail": typeof shared_authEmail;
  "shared/authOrigins": typeof shared_authOrigins;
  "shared/authSecurity": typeof shared_authSecurity;
  "shared/cases": typeof shared_cases;
  "shared/community": typeof shared_community;
  "shared/documentCompatibility": typeof shared_documentCompatibility;
  "shared/evidenceRequirements": typeof shared_evidenceRequirements;
  "shared/interviewSteps": typeof shared_interviewSteps;
  "shared/interviewValidation": typeof shared_interviewValidation;
  "shared/navigator": typeof shared_navigator;
  "shared/navigatorPrompt": typeof shared_navigatorPrompt;
  "shared/news": typeof shared_news;
  "shared/readiness": typeof shared_readiness;
  "shared/renewals": typeof shared_renewals;
  "shared/reviewModel": typeof shared_reviewModel;
  "shared/screening": typeof shared_screening;
  "shared/socialProviders": typeof shared_socialProviders;
  "shared/tempAccounts": typeof shared_tempAccounts;
  socialLogin: typeof socialLogin;
  tempAccounts: typeof tempAccounts;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  betterAuth: import("@convex-dev/better-auth/_generated/component.js").ComponentApi<"betterAuth">;
};
