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

import { adjustRestriction } from '../../src/definitions/transformation_utils'

describe('restriction transformation utils', () => {
  describe('adjustRestriction', () => {
    it('should remove redundant fields in user restrictions and extract items from the results fields', () => {
      const item = {
        typeName: 'mockType',
        context: {},
        value: {
          restrictions: {
            user: {
              results: [
                {
                  type: 'known',
                  accountId: 'account-id',
                  accountType: 'atlassian',
                  email: 'some@email.com',
                  publicName: 'something',
                  profilePicture: {
                    path: '/some/oath',
                    width: 48,
                    height: 48,
                    isDefault: false,
                  },
                  displayName: 'something',
                  isExternalCollaborator: false,
                  _expandable: {
                    operations: '',
                    personalSpace: '',
                  },
                  _links: {
                    self: 'http://localhost/123',
                  },
                },
              ],
              start: 0,
              limit: 100,
              size: 1,
            },
            group: {
              results: [
                {
                  type: 'group',
                  name: 'group-name',
                  id: 'group-id',
                  _links: {
                    self: 'http://localhost/123',
                  },
                },
              ],
              start: 0,
              limit: 100,
              size: 1,
            },
          },
        },
      }
      expect(adjustRestriction(item).value).toEqual({
        restrictions: {
          user: [
            {
              type: 'known',
              accountId: 'account-id',
              accountType: 'atlassian',
              email: 'some@email.com',
              isExternalCollaborator: false,
              _expandable: {
                operations: '',
                personalSpace: '',
              },
              _links: {
                self: 'http://localhost/123',
              },
            },
          ],
          group: [
            {
              type: 'group',
              name: 'group-name',
              id: 'group-id',
              _links: {
                self: 'http://localhost/123',
              },
            },
          ],
        },
      })
    })
    it('should return empty group and user restrictions if there are no restrictions', () => {
      const item = {
        typeName: 'mockType',
        context: {},
        value: {},
      }
      expect(adjustRestriction(item).value).toEqual({
        restrictions: {
          user: undefined,
          group: undefined,
        },
      })
    })
  })
})