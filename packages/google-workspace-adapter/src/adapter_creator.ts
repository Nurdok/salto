/*
 *                      Copyright 2024 Salto Labs Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { InstanceElement } from '@salto-io/adapter-api'
import { client as clientUtils, createAdapter, credentials } from '@salto-io/adapter-components'
import { Credentials, basicCredentialsType } from './auth'
import { DEFAULT_CONFIG, UserConfig } from './config'
import { createConnectionForApp } from './client/connection'
import { ADAPTER_NAME } from './constants'
import { createClientDefinitions, createDeployDefinitions, createFetchDefinitions } from './definitions'
import { PAGINATION } from './definitions/requests/pagination'
import { REFERENCES } from './definitions/references'
import { Options } from './definitions/types'
import {
  DIRECTORY_APP_NAME,
  GROUP_SETTINGS_APP_NAME,
  createFromOauthResponse,
  createOAuthRequest,
  oauthAccessTokenCredentialsType,
  oauthRequestParametersType,
} from './client/oauth'

const { validateCredentials, DEFAULT_RETRY_OPTS, RATE_LIMIT_UNLIMITED_MAX_CONCURRENT_REQUESTS } = clientUtils

const { defaultCredentialsFromConfig } = credentials

const credentialsFromConfig = (config: Readonly<InstanceElement>): Credentials => config.value as Credentials

const clientDefaults = {
  rateLimit: {
    total: 100,
    get: 100,
    deploy: 100,
  },
  maxRequestsPerMinute: RATE_LIMIT_UNLIMITED_MAX_CONCURRENT_REQUESTS,
  retry: DEFAULT_RETRY_OPTS,
}

export const adapter = createAdapter<Credentials, Options, UserConfig>({
  adapterName: ADAPTER_NAME,
  authenticationMethods: {
    basic: {
      credentialsType: basicCredentialsType,
    },
    oauth: {
      createOAuthRequest,
      credentialsType: oauthAccessTokenCredentialsType,
      oauthRequestParameters: oauthRequestParametersType,
      createFromOauthResponse,
    },
  },
  validateCredentials: async config =>
    validateCredentials(credentialsFromConfig(config), {
      createConnection: createConnectionForApp(DIRECTORY_APP_NAME),
    }),
  defaultConfig: DEFAULT_CONFIG,
  definitionsCreator: ({ clients }) => ({
    clients: createClientDefinitions(clients),
    pagination: PAGINATION,
    fetch: createFetchDefinitions(),
    deploy: createDeployDefinitions(),
    references: REFERENCES,
  }),
  operationsCustomizations: {
    connectionCreatorFromConfig: () => createConnectionForApp(DIRECTORY_APP_NAME),
    credentialsFromConfig: defaultCredentialsFromConfig,
  },
  initialClients: {
    main: undefined,
    groupSettings: createConnectionForApp(GROUP_SETTINGS_APP_NAME),
  },
  clientDefaults,
})
