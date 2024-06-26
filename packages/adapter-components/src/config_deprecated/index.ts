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
export {
  createDucktypeAdapterApiConfigType,
  AdapterDuckTypeApiConfig,
  DuckTypeTransformationConfig,
  DuckTypeTransformationDefaultConfig,
  TypeDuckTypeConfig,
  TypeDuckTypeDefaultsConfig,
  validateApiDefinitionConfig as validateDuckTypeApiDefinitionConfig,
  validateFetchConfig as validateDuckTypeFetchConfig,
  validateDefaultWithCustomizations,
} from './ducktype'
export {
  createRequestConfigs,
  validateRequestConfig,
  FetchRequestConfig,
  DeployRequestConfig,
  UrlParams,
  DeploymentRequestsByAction,
  RecurseIntoConfig,
} from './request'
export { ReferenceDefinitions } from '../definitions/system/references'
export {
  createAdapterApiConfigType,
  getConfigWithDefault,
  AdapterApiConfig,
  TypeConfig,
  TypeDefaultsConfig,
  validateSupportedTypes,
  defaultMissingUserFallbackField,
  AdapterFetchError,
} from './shared'
export { mergeWithDefaultConfig } from './merge'
export {
  createTypeNameOverrideConfigType,
  createSwaggerAdapterApiConfigType,
  AdapterSwaggerApiConfig,
  RequestableAdapterSwaggerApiConfig,
  SwaggerDefinitionBaseConfig,
  TypeSwaggerConfig,
  RequestableTypeSwaggerConfig,
  TypeSwaggerDefaultConfig,
  TypeNameOverrideConfig,
  validateApiDefinitionConfig as validateSwaggerApiDefinitionConfig,
  validateFetchConfig as validateSwaggerFetchConfig,
} from './swagger'
export {
  createTransformationConfigTypes,
  validateTransformationConfig,
  TransformationDefaultConfig,
  TransformationConfig,
  StandaloneFieldConfigType,
  FieldToOmitType,
  FieldToHideType,
  getTransformationConfigByType,
  dereferenceFieldName,
  isReferencedIdField,
  getTypeTransformationConfig,
  shouldNestFiles,
} from './transformation'
