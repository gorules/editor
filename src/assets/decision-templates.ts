import { DecisionContent } from '../helpers/graph.ts';

export const decisionTemplates: Record<string, DecisionContent> = {
  'shipping-fees': {
    edges: [
      {
        id: '1dfbc57d-ad1f-4cf8-978a-e43241856fc8',
        type: 'edge',
        sourceId: 'be0a5c2d-538d-4e50-9843-91b274e1b9d8',
        targetId: '7c07550a-07bc-4ee4-80d6-9ad900e3d6c9',
      },
      {
        id: '5e2dc187-3b82-4f21-94f5-9c3fd16e12d4',
        type: 'edge',
        sourceId: '7c07550a-07bc-4ee4-80d6-9ad900e3d6c9',
        targetId: '72d52cfc-e866-4c11-bf79-6be9f750e4d7',
      },
    ],
    nodes: [
      {
        id: 'be0a5c2d-538d-4e50-9843-91b274e1b9d8',
        name: 'Request',
        type: 'inputNode',
        position: {
          x: 180,
          y: 280,
        },
      },
      {
        id: '7c07550a-07bc-4ee4-80d6-9ad900e3d6c9',
        name: 'Fees',
        type: 'decisionTableNode',
        content: {
          rules: [
            {
              _id: 'vCqrZGdWjA',
              'DA3Ybo-shA': '"US"',
              FD4qBBPv2G: '> 1000',
              JuUcECFGe1: '2',
              jrsT5Wg9F8: '"gold"',
              qA7iYc3Wle: '',
            },
            {
              _id: 'CpXx-s78FH',
              'DA3Ybo-shA': '"US"',
              FD4qBBPv2G: '> 1000',
              JuUcECFGe1: '3',
              jrsT5Wg9F8: '',
              qA7iYc3Wle: '',
            },
            {
              _id: 'zH-PuRB2aQ',
              'DA3Ybo-shA': '"US"',
              FD4qBBPv2G: '',
              JuUcECFGe1: '',
              jrsT5Wg9F8: '',
              qA7iYc3Wle: '25',
            },
            {
              _id: 'HjEp-eQhAP',
              'DA3Ybo-shA': '"CA","MX"',
              FD4qBBPv2G: '> 1000',
              JuUcECFGe1: '5',
              jrsT5Wg9F8: '',
              qA7iYc3Wle: '',
            },
            {
              _id: 'nq40hJ1nXy',
              'DA3Ybo-shA': '"CA","MX"',
              FD4qBBPv2G: '',
              JuUcECFGe1: '',
              jrsT5Wg9F8: '',
              qA7iYc3Wle: '50',
            },
            {
              _id: 'G64ltgrVgV',
              'DA3Ybo-shA': '"IE","UK","FR","DE"',
              FD4qBBPv2G: '> 1000',
              JuUcECFGe1: '10',
              jrsT5Wg9F8: '',
              qA7iYc3Wle: '',
            },
            {
              _id: 'PD3oYgtiDa',
              'DA3Ybo-shA': '"IE","UK","FR","DE"',
              FD4qBBPv2G: '',
              JuUcECFGe1: '',
              jrsT5Wg9F8: '',
              qA7iYc3Wle: '100',
            },
            {
              _id: '1BY7iMFoDw',
              'DA3Ybo-shA': '',
              FD4qBBPv2G: '> 1000',
              JuUcECFGe1: '15',
              jrsT5Wg9F8: '',
              qA7iYc3Wle: '',
            },
            {
              _id: 'dlwJlbW7ZH',
              'DA3Ybo-shA': '',
              FD4qBBPv2G: '',
              JuUcECFGe1: '',
              jrsT5Wg9F8: '',
              qA7iYc3Wle: '150',
            },
          ],
          inputs: [
            {
              id: 'FD4qBBPv2G',
              name: 'Cart Total',
              type: 'expression',
              field: 'cart.total',
            },
            {
              id: 'DA3Ybo-shA',
              name: 'Customer Country',
              type: 'expression',
              field: 'customer.country',
            },
            {
              id: 'jrsT5Wg9F8',
              name: 'Customer Tier',
              type: 'expression',
              field: 'customer.tier',
            },
          ],
          outputs: [
            {
              id: 'qA7iYc3Wle',
              name: 'Fees Flat ($)',
              type: 'expression',
              field: 'fees.flat',
            },
            {
              id: 'JuUcECFGe1',
              name: 'Fees Percent',
              type: 'expression',
              field: 'fees.percent',
            },
          ],
          hitPolicy: 'first',
        },
        position: {
          x: 420,
          y: 280,
        },
      },
      {
        id: '72d52cfc-e866-4c11-bf79-6be9f750e4d7',
        name: 'Response',
        type: 'outputNode',
        position: {
          x: 670,
          y: 280,
        },
      },
    ],
  },
  'company-analysis': {
    edges: [
      {
        id: '3e749d7f-97d5-45c9-917f-20ae877c3bde',
        type: 'edge',
        sourceId: '4e7e6bb9-f128-41e7-8cc5-b9d79670b96a',
        targetId: 'abaaa033-5516-440c-b211-35f1d616ad9f',
      },
      {
        id: 'd00252c1-9a54-4599-940c-c9c1c3bb6800',
        type: 'edge',
        sourceId: '4e7e6bb9-f128-41e7-8cc5-b9d79670b96a',
        targetId: '46fbad36-4bbe-44ac-833f-d30e0d37d8d7',
      },
      {
        id: 'f5be27b5-4eea-40f4-abce-31081a0caf65',
        type: 'edge',
        sourceId: '4e7e6bb9-f128-41e7-8cc5-b9d79670b96a',
        targetId: 'd6925cde-b3c9-4b7f-8652-7380dacea6a4',
      },
      {
        id: 'ae341e14-2d25-4941-a42f-eb587c17f9f5',
        type: 'edge',
        sourceId: 'abaaa033-5516-440c-b211-35f1d616ad9f',
        targetId: '95aa8f3c-f371-4e48-beb3-0b5775d2a814',
      },
      {
        id: '3000e420-4846-4f86-8ed2-f595d204672e',
        type: 'edge',
        sourceId: '46fbad36-4bbe-44ac-833f-d30e0d37d8d7',
        targetId: '95aa8f3c-f371-4e48-beb3-0b5775d2a814',
      },
      {
        id: '638c35a9-eef7-4d90-bf1e-58ba10734d98',
        type: 'edge',
        sourceId: 'd6925cde-b3c9-4b7f-8652-7380dacea6a4',
        targetId: '95aa8f3c-f371-4e48-beb3-0b5775d2a814',
      },
      {
        id: '30f2247a-140c-40f3-8160-a4e61d56da8e',
        type: 'edge',
        sourceId: 'af6cdac4-2019-4a0f-9715-2ecfb27e0bfc',
        targetId: '86ce04c9-b4dd-4513-ae2b-7f585ceb224a',
      },
      {
        id: '822d2eeb-5a9e-4670-b181-4af0ed6dd9b9',
        type: 'edge',
        sourceId: '86ce04c9-b4dd-4513-ae2b-7f585ceb224a',
        targetId: '95aa8f3c-f371-4e48-beb3-0b5775d2a814',
      },
      {
        id: '61cc8c10-57c2-411d-a88c-90176ebb8593',
        type: 'edge',
        sourceId: 'd6925cde-b3c9-4b7f-8652-7380dacea6a4',
        targetId: 'af6cdac4-2019-4a0f-9715-2ecfb27e0bfc',
      },
      {
        id: '2011fc65-fd8c-421f-8123-d1fb5f1accb3',
        type: 'edge',
        sourceId: '46fbad36-4bbe-44ac-833f-d30e0d37d8d7',
        targetId: 'af6cdac4-2019-4a0f-9715-2ecfb27e0bfc',
      },
      {
        id: 'd65fb53d-0fef-47ff-aeac-b8cbac5af7be',
        type: 'edge',
        sourceId: 'abaaa033-5516-440c-b211-35f1d616ad9f',
        targetId: 'af6cdac4-2019-4a0f-9715-2ecfb27e0bfc',
      },
    ],
    nodes: [
      {
        id: '4e7e6bb9-f128-41e7-8cc5-b9d79670b96a',
        name: 'Request',
        type: 'inputNode',
        position: {
          x: 70,
          y: 160,
        },
      },
      {
        id: 'd6925cde-b3c9-4b7f-8652-7380dacea6a4',
        name: 'Company Type',
        type: 'decisionTableNode',
        content: {
          rules: [
            {
              _id: 'D8T0xuyYLC',
              'Yi49Ln4-V_': '"green"',
              nd30YgUKve: '"INC","LTD","LLC"',
            },
            {
              _id: 'Ewgtm_21qr',
              'Yi49Ln4-V_': '"amber"',
              nd30YgUKve: '',
            },
          ],
          inputs: [
            {
              id: 'nd30YgUKve',
              name: 'Company Type',
              type: 'expression',
              field: 'company.type',
            },
          ],
          outputs: [
            {
              id: 'Yi49Ln4-V_',
              name: 'Flag CompanyType',
              type: 'expression',
              field: 'flag.companyType',
            },
          ],
          hitPolicy: 'first',
        },
        position: {
          x: 380,
          y: 270,
        },
      },
      {
        id: '46fbad36-4bbe-44ac-833f-d30e0d37d8d7',
        name: 'Turnover',
        type: 'decisionTableNode',
        content: {
          rules: [
            {
              _id: 'fJxWqBVUNk',
              '6xj5CMIFv9': '> 1_000_000',
              rrW6s3l7vU: '"green"',
            },
            {
              _id: 'lqBoqkvWHA',
              '6xj5CMIFv9': '[200_000..1_000_000]',
              rrW6s3l7vU: '"amber"',
            },
            {
              _id: 'YO3K4Q1iuU',
              '6xj5CMIFv9': '< 200_000',
              rrW6s3l7vU: '"red"',
            },
            {
              _id: 'SY7uwJEPqS',
              '6xj5CMIFv9': '',
              rrW6s3l7vU: '"red"',
            },
          ],
          inputs: [
            {
              id: '6xj5CMIFv9',
              name: 'Turnover (LY)',
              type: 'expression',
              field: 'company.turnover',
            },
          ],
          outputs: [
            {
              id: 'rrW6s3l7vU',
              name: 'Flag Turnover',
              type: 'expression',
              field: 'flag.turnover',
            },
          ],
          hitPolicy: 'first',
        },
        position: {
          x: 380,
          y: 160,
        },
      },
      {
        id: 'abaaa033-5516-440c-b211-35f1d616ad9f',
        name: 'Country',
        type: 'decisionTableNode',
        content: {
          rules: [
            {
              _id: 'TOi2qECISd',
              I493u7jDPg: '"green"',
              bGOSakKon0: '',
              'z87lDk-Xar': '"US","IE","GB","CA"',
            },
            {
              _id: 'aGPqCdh2tU',
              I493u7jDPg: '"amber"',
              bGOSakKon0: 'true',
              'z87lDk-Xar': '',
            },
            {
              _id: 'VYiuLkrLWb',
              I493u7jDPg: '"red"',
              bGOSakKon0: '',
              'z87lDk-Xar': '',
            },
          ],
          inputs: [
            {
              id: 'z87lDk-Xar',
              name: 'Company Country',
              type: 'expression',
              field: 'company.country',
            },
            {
              id: 'bGOSakKon0',
              name: 'Company IsEU',
              type: 'expression',
              field: 'company.isEu',
            },
          ],
          outputs: [
            {
              id: 'I493u7jDPg',
              name: 'Flag Country',
              type: 'expression',
              field: 'flag.country',
            },
          ],
          hitPolicy: 'first',
        },
        position: {
          x: 380,
          y: 50,
        },
      },
      {
        id: 'af6cdac4-2019-4a0f-9715-2ecfb27e0bfc',
        name: 'Overall Mapper',
        type: 'functionNode',
        content:
          "/**\n* @param {import('gorules').Input} input\n* @param {{\n*  moment: import('dayjs')\n*  env: Record<string, any>\n* }} helpers\n*/\nconst handler = (input, { moment, env }) => {\n  const count = (flag) => Object.values(input?.flag || {}).reduce((acc, curr) => {\n    if (curr === flag) return acc + 1;\n    return acc;\n  }, 0);\n\n  return {\n    critical: count('critical'),\n    red: count('red'),\n    amber: count('amber'),\n    green: count('green')\n  };\n}",
        position: {
          x: 630,
          y: 270,
        },
      },
      {
        id: '86ce04c9-b4dd-4513-ae2b-7f585ceb224a',
        name: 'Overall',
        type: 'decisionTableNode',
        content: {
          rules: [
            {
              _id: 'P0RQ3NFWfc',
              AczIUwvClr: '',
              KsBwLhAedP: '> 0',
              QJttqyV2FB: '',
              ek5q9WgLL9: '"red"',
              iFQl1CKB5S: '',
            },
            {
              _id: 'UGrT2iHE61',
              AczIUwvClr: '> 0',
              KsBwLhAedP: '',
              QJttqyV2FB: '',
              ek5q9WgLL9: '"red"',
              iFQl1CKB5S: '',
            },
            {
              _id: 'SBBO_aWujh',
              AczIUwvClr: '',
              KsBwLhAedP: '',
              QJttqyV2FB: '> 1',
              ek5q9WgLL9: '"amber"',
              iFQl1CKB5S: '',
            },
            {
              _id: 'N2jO9BnXHY',
              AczIUwvClr: '',
              KsBwLhAedP: '',
              QJttqyV2FB: '',
              ek5q9WgLL9: '"green"',
              iFQl1CKB5S: '',
            },
          ],
          inputs: [
            {
              id: 'AczIUwvClr',
              name: 'Red',
              type: 'expression',
              field: 'red',
            },
            {
              id: 'QJttqyV2FB',
              name: 'Amber',
              type: 'expression',
              field: 'amber',
            },
            {
              id: 'iFQl1CKB5S',
              name: 'Green',
              type: 'expression',
              field: 'green',
            },
            {
              id: 'KsBwLhAedP',
              name: 'Critical',
              type: 'expression',
              field: 'critical',
            },
          ],
          outputs: [
            {
              id: 'ek5q9WgLL9',
              name: 'Overall',
              type: 'expression',
              field: 'overall',
            },
          ],
          hitPolicy: 'first',
        },
        position: {
          x: 880,
          y: 270,
        },
      },
      {
        id: '95aa8f3c-f371-4e48-beb3-0b5775d2a814',
        name: 'Response',
        type: 'outputNode',
        position: {
          x: 1120,
          y: 160,
        },
      },
    ],
  },
  aml: {
    nodes: [
      {
        id: 'df092198-208d-4526-82a2-2ff4359d9001',
        type: 'inputNode',
        position: {
          x: 90,
          y: 330,
        },
        name: 'Request',
      },
      {
        id: 'f7e19179-48b7-4d94-b085-ea3d6c9e829e',
        type: 'switchNode',
        position: {
          x: 400,
          y: 440,
        },
        name: 'Sanctions',
        content: {
          hitPolicy: 'collect',
          statements: [
            {
              id: '5bffb0f5-a69d-46ba-9122-08bae9f6fe92',
              condition: 'transaction.currency == "USD"',
            },
            {
              id: '13737427-cb8c-4c32-bde5-e49ef6fa03e0',
              condition: 'transaction.currency == "EUR"',
            },
            {
              id: 'aa630466-3bb1-45e3-9ae8-12eb57451f55',
              condition: '',
            },
          ],
        },
      },
      {
        id: '9bc09d87-84ce-4f4c-9c53-317688ee6cc5',
        type: 'decisionTableNode',
        position: {
          x: 700,
          y: 520,
        },
        name: 'USD Sanctions',
        content: {
          hitPolicy: 'first',
          inputs: [
            {
              id: 'e03b1f07-7d3a-4a64-9aa5-aca83e4cfa01',
              name: 'Merchant country',
              type: 'expression',
              field: 'merchant.location.country',
            },
          ],
          outputs: [
            {
              id: '1959963a-2aec-4988-87a5-bfc590ca08c4',
              name: 'Output',
              type: 'expression',
              field: 'flags.usdSanction',
            },
          ],
          rules: [
            {
              _id: 'fca1348e-026f-4356-a443-617fa99909eb',
              'e03b1f07-7d3a-4a64-9aa5-aca83e4cfa01': '"RU", "CU", "KP", "VE"',
              '1959963a-2aec-4988-87a5-bfc590ca08c4': '"red"',
            },
            {
              _id: '26b794b7-26ce-4e51-9432-cf1d3580a638',
              'e03b1f07-7d3a-4a64-9aa5-aca83e4cfa01': '',
              '1959963a-2aec-4988-87a5-bfc590ca08c4': '"green"',
            },
          ],
        },
      },
      {
        id: '3187c4af-565f-482c-805f-9099e9d56fc1',
        type: 'decisionTableNode',
        position: {
          x: 700,
          y: 620,
        },
        name: 'EUR Sanctions',
        content: {
          hitPolicy: 'first',
          inputs: [
            {
              id: '90adfc05-ffdf-490f-ab47-cede8dd899f3',
              name: 'Location',
              type: 'expression',
              field: 'merchant.location.country',
            },
          ],
          outputs: [
            {
              id: 'e49398d3-cc2b-4e5a-81b0-e50fd020b5c0',
              name: 'Output',
              type: 'expression',
              field: 'flags.eurSanctions',
            },
          ],
          rules: [
            {
              _id: 'ff990579-78ff-4a25-9706-eae402a26c4e',
              '90adfc05-ffdf-490f-ab47-cede8dd899f3': '"RU", "NK"',
              'e49398d3-cc2b-4e5a-81b0-e50fd020b5c0': '"red"',
            },
            {
              _id: '380670ff-4a6a-48d6-b430-8cbb6186438b',
              '90adfc05-ffdf-490f-ab47-cede8dd899f3': '"VE", "IR"',
              'e49398d3-cc2b-4e5a-81b0-e50fd020b5c0': '"amber"',
            },
            {
              _id: '5fb3c366-54d5-4a17-bbd0-88f2d65ce99d',
              '90adfc05-ffdf-490f-ab47-cede8dd899f3': '',
              'e49398d3-cc2b-4e5a-81b0-e50fd020b5c0': '"green"',
            },
          ],
        },
      },
      {
        id: 'fd8f6200-f236-4d00-859e-9a732e553176',
        type: 'decisionTableNode',
        position: {
          x: 700,
          y: 720,
        },
        name: 'Global Sanctions',
        content: {
          hitPolicy: 'first',
          inputs: [
            {
              id: 'c31240e0-8761-4c31-9f79-5210a656f820',
              name: 'Input',
              type: 'expression',
            },
          ],
          outputs: [
            {
              id: '156ad457-da15-468b-9444-978f37c28463',
              name: 'Output',
              type: 'expression',
              field: 'flags.globalSanctions',
            },
          ],
          rules: [
            {
              _id: 'e19c68ab-6db3-41b2-baef-8b5cca4254a9',
              'c31240e0-8761-4c31-9f79-5210a656f820': '"RU", "NK"',
              '156ad457-da15-468b-9444-978f37c28463': '"red"',
            },
            {
              _id: '380eee74-94aa-4321-a673-878386dc3200',
              'c31240e0-8761-4c31-9f79-5210a656f820': '',
              '156ad457-da15-468b-9444-978f37c28463': '"green"',
            },
          ],
        },
      },
      {
        id: '204af8f6-325f-41cc-a5bd-ee99905d8c1f',
        type: 'functionNode',
        position: {
          x: 1060,
          y: 360,
        },
        name: 'Aggregator',
        content:
          "/**\n * @param input\n * @param {{\n *  dayjs: import('dayjs')\n *  Big: import('big.js').BigConstructor\n * }} helpers\n */\nconst handler = (input, { dayjs, Big }) => {\n  const flags = input.flags || {};\n  const countFlags = (flag) => Object.values(flags).reduce((acc, curr) => {\n    return curr == flag ? acc + 1 : acc;\n  }, 0);\n\n  const breakdown = {\n    red: countFlags('red'),\n    amber: countFlags('amber'),\n    green: countFlags('green')\n  };\n\n  let overallFlag = 'green';\n  if (breakdown.amber > 0) {\n    overallFlag = 'amber';\n  }\n  if (breakdown.red > 0) {\n    overallFlag = 'red';\n  }\n\n  return {\n    ...input,\n    breakdown,\n    overallFlag,\n  };\n}",
      },
      {
        id: 'ac9cf968-98b2-4ba5-a481-28da1e32b649',
        type: 'decisionTableNode',
        position: {
          x: 460,
          y: 220,
        },
        name: 'Transaction Amount',
        content: {
          hitPolicy: 'first',
          inputs: [
            {
              id: 'a713c7ef-1db6-4fa4-aca4-590c4092c742',
              name: 'Customer Tier',
              type: 'expression',
              field: 'customer.tier',
            },
            {
              id: '360ba5d7-25b0-44ff-9cce-3f365634a42f',
              type: 'expression',
              field: 'transaction.amountUSD',
              name: 'Transaction Amount USD',
            },
          ],
          outputs: [
            {
              id: '245ca04d-fd91-4c2b-80a5-660ec16d5ac1',
              name: 'Transaction amount flag',
              type: 'expression',
              field: 'flags.transactionAmount',
            },
          ],
          rules: [
            {
              _id: '3819029a-2446-47ed-ae6c-268c23f06ad2',
              'a713c7ef-1db6-4fa4-aca4-590c4092c742': '"enterprise"',
              '360ba5d7-25b0-44ff-9cce-3f365634a42f': '> 50_000',
              '245ca04d-fd91-4c2b-80a5-660ec16d5ac1': '"amber"',
            },
            {
              _id: '831b4587-4f1b-494c-97c3-da2861991779',
              'a713c7ef-1db6-4fa4-aca4-590c4092c742': '"enterprise"',
              '360ba5d7-25b0-44ff-9cce-3f365634a42f': '',
              '245ca04d-fd91-4c2b-80a5-660ec16d5ac1': '"green"',
            },
            {
              _id: '94556461-324d-4a4b-a039-2b703203ae64',
              'a713c7ef-1db6-4fa4-aca4-590c4092c742': '"business"',
              '360ba5d7-25b0-44ff-9cce-3f365634a42f': '> 100_000',
              '245ca04d-fd91-4c2b-80a5-660ec16d5ac1': '"red"',
            },
            {
              _id: 'e4170bfe-9ceb-49d4-9ef8-c56e2d3501e9',
              'a713c7ef-1db6-4fa4-aca4-590c4092c742': '"business"',
              '360ba5d7-25b0-44ff-9cce-3f365634a42f': '> 20_000',
              '245ca04d-fd91-4c2b-80a5-660ec16d5ac1': '"amber"',
            },
            {
              _id: '0156a3ca-aca4-42a0-8d6a-f55290501573',
              'a713c7ef-1db6-4fa4-aca4-590c4092c742': '"business"',
              '360ba5d7-25b0-44ff-9cce-3f365634a42f': '',
              '245ca04d-fd91-4c2b-80a5-660ec16d5ac1': '"green"',
            },
            {
              _id: '26fbd01d-e355-49c9-88ad-7f5b00d4118a',
              'a713c7ef-1db6-4fa4-aca4-590c4092c742': '',
              '360ba5d7-25b0-44ff-9cce-3f365634a42f': '> 50_000',
              '245ca04d-fd91-4c2b-80a5-660ec16d5ac1': '"red"',
            },
            {
              _id: '65f91c4f-bf69-40fa-86c6-36ad71abbc1b',
              'a713c7ef-1db6-4fa4-aca4-590c4092c742': '',
              '360ba5d7-25b0-44ff-9cce-3f365634a42f': '> 10_000',
              '245ca04d-fd91-4c2b-80a5-660ec16d5ac1': '"amber"',
            },
            {
              _id: '58cf804e-ad94-4ed6-99fe-8263ae8cf7cd',
              'a713c7ef-1db6-4fa4-aca4-590c4092c742': '',
              '360ba5d7-25b0-44ff-9cce-3f365634a42f': '',
              '245ca04d-fd91-4c2b-80a5-660ec16d5ac1': '"green"',
            },
          ],
        },
      },
      {
        id: '57b828f3-e0ff-4e3a-9549-7dae4eeba55d',
        type: 'decisionTableNode',
        position: {
          x: 460,
          y: 330,
        },
        name: 'Merchant Reputation',
        content: {
          hitPolicy: 'first',
          inputs: [
            {
              id: 'c658ae97-99c8-46fe-bc3a-64c14ea8c475',
              name: 'Merchant reputation',
              type: 'expression',
              field: 'merchant.reputation',
            },
          ],
          outputs: [
            {
              id: '71bf3b59-455d-4a6e-894c-4e3a7cf7cbde',
              name: 'Merchant Reputation Flag',
              type: 'expression',
              field: 'flags.merchantReputation',
            },
          ],
          rules: [
            {
              _id: 'e8a05a05-d7f7-4272-94a1-c5aa84b0feaf',
              'c658ae97-99c8-46fe-bc3a-64c14ea8c475': '(0.8..1.0]',
              '71bf3b59-455d-4a6e-894c-4e3a7cf7cbde': '"green"',
            },
            {
              _id: 'cdee900f-a1b1-4a0c-8aca-c305c19a33dd',
              'c658ae97-99c8-46fe-bc3a-64c14ea8c475': '(0.5..0.8]',
              '71bf3b59-455d-4a6e-894c-4e3a7cf7cbde': '"amber"',
            },
            {
              _id: '5c58e04a-94b8-40ec-8709-39847e2d4704',
              'c658ae97-99c8-46fe-bc3a-64c14ea8c475': '',
              '71bf3b59-455d-4a6e-894c-4e3a7cf7cbde': '"red"',
            },
          ],
        },
      },
      {
        id: '71285ae0-45cf-4300-afe7-de39e0f81590',
        type: 'outputNode',
        position: {
          x: 1320,
          y: 360,
        },
        name: 'Response',
      },
    ],
    edges: [
      {
        id: '284924aa-b0e8-4161-bfc0-4cadb7a581a6',
        sourceId: 'df092198-208d-4526-82a2-2ff4359d9001',
        type: 'edge',
        targetId: 'f7e19179-48b7-4d94-b085-ea3d6c9e829e',
      },
      {
        id: 'bbacf049-12b4-406d-bf36-1b68a9640992',
        sourceId: 'f7e19179-48b7-4d94-b085-ea3d6c9e829e',
        type: 'edge',
        targetId: '9bc09d87-84ce-4f4c-9c53-317688ee6cc5',
        sourceHandle: '5bffb0f5-a69d-46ba-9122-08bae9f6fe92',
      },
      {
        id: '79e399d4-57ba-46ec-8f74-12260081043f',
        sourceId: 'f7e19179-48b7-4d94-b085-ea3d6c9e829e',
        type: 'edge',
        targetId: '3187c4af-565f-482c-805f-9099e9d56fc1',
        sourceHandle: '13737427-cb8c-4c32-bde5-e49ef6fa03e0',
      },
      {
        id: 'da7e7f8b-1e05-4189-afa4-42423be11367',
        sourceId: 'f7e19179-48b7-4d94-b085-ea3d6c9e829e',
        type: 'edge',
        targetId: 'fd8f6200-f236-4d00-859e-9a732e553176',
        sourceHandle: 'aa630466-3bb1-45e3-9ae8-12eb57451f55',
      },
      {
        id: '5624c75f-9f3c-4739-983d-9cf509967201',
        sourceId: '9bc09d87-84ce-4f4c-9c53-317688ee6cc5',
        type: 'edge',
        targetId: '204af8f6-325f-41cc-a5bd-ee99905d8c1f',
      },
      {
        id: '6d2d4d98-901a-4304-82e1-bc67219308a8',
        sourceId: '3187c4af-565f-482c-805f-9099e9d56fc1',
        type: 'edge',
        targetId: '204af8f6-325f-41cc-a5bd-ee99905d8c1f',
      },
      {
        id: 'f0c921b9-9b8c-43ab-9215-ed9b3af54d88',
        sourceId: 'fd8f6200-f236-4d00-859e-9a732e553176',
        type: 'edge',
        targetId: '204af8f6-325f-41cc-a5bd-ee99905d8c1f',
      },
      {
        id: '1fd5ad15-4bdf-451c-9bdc-f34424382e0b',
        sourceId: 'df092198-208d-4526-82a2-2ff4359d9001',
        type: 'edge',
        targetId: '57b828f3-e0ff-4e3a-9549-7dae4eeba55d',
      },
      {
        id: 'fd6caf40-ef8f-4a2e-bf05-a42bb7f33236',
        sourceId: 'df092198-208d-4526-82a2-2ff4359d9001',
        type: 'edge',
        targetId: 'ac9cf968-98b2-4ba5-a481-28da1e32b649',
      },
      {
        id: '74c48816-e17d-4d44-83da-e05940e778c7',
        sourceId: 'ac9cf968-98b2-4ba5-a481-28da1e32b649',
        type: 'edge',
        targetId: '204af8f6-325f-41cc-a5bd-ee99905d8c1f',
      },
      {
        id: 'ac21ce5c-0a87-4f23-8006-0d75b782f5dd',
        sourceId: '57b828f3-e0ff-4e3a-9549-7dae4eeba55d',
        type: 'edge',
        targetId: '204af8f6-325f-41cc-a5bd-ee99905d8c1f',
      },
      {
        id: '0af5670d-eb0f-4051-a129-843488525e43',
        sourceId: '204af8f6-325f-41cc-a5bd-ee99905d8c1f',
        type: 'edge',
        targetId: '71285ae0-45cf-4300-afe7-de39e0f81590',
      },
    ],
  },
};
