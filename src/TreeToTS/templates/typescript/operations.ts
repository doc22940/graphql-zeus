import { Environment } from 'Models/Environment';
import { OperationName, ResolvedOperations } from 'TreeToTS';
import { OperationType } from '../../../Models';
import { VALUETYPES } from '../resolveValueTypes';
import { constantTypesTypescript, graphqlErrorTypeScript, typescriptFunctions } from './';

const generateOperationChaining = (t: OperationName, ot: OperationType): string =>
  `${ot}: ((o: any) =>
    fullChainConstruct(options)('${ot}', '${t.name}')(o).then(
      (response: any) => response
    )) as OperationToGraphQL<${VALUETYPES}["${t.name}"],${t.name}>`;

const generateOperationsChaining = ({ query, mutation, subscription }: Partial<ResolvedOperations>): string[] => {
  const allOps: string[] = [];
  if (query?.operationName?.name && query.operations.length) {
    allOps.push(generateOperationChaining(query.operationName, OperationType.query));
  }
  if (mutation?.operationName?.name && mutation.operations.length) {
    allOps.push(generateOperationChaining(mutation.operationName, OperationType.mutation));
  }
  if (subscription?.operationName?.name && subscription.operations.length) {
    allOps.push(generateOperationChaining(subscription.operationName, OperationType.subscription));
  }
  return allOps;
};

const generateOperationZeus = (t: OperationName, ot: OperationType): string =>
  `${ot}: (o:${VALUETYPES}["${t.name}"]) => queryConstruct('${ot}', '${t.name}')(o)`;

const generateOperationsZeusTypeScript = ({ query, mutation, subscription }: Partial<ResolvedOperations>): string[] => {
  const allOps: string[] = [];
  if (query?.operationName?.name && query.operations.length) {
    allOps.push(generateOperationZeus(query.operationName, OperationType.query));
  }
  if (mutation?.operationName?.name && mutation.operations.length) {
    allOps.push(generateOperationZeus(mutation.operationName, OperationType.mutation));
  }
  if (subscription?.operationName?.name && subscription.operations.length) {
    allOps.push(generateOperationZeus(subscription.operationName, OperationType.subscription));
  }
  return allOps;
};

const generateSelectorZeus = (t: OperationName, ot: OperationType): string =>
  `${ot}: ZeusSelect<${VALUETYPES}["${t.name}"]>()`;

const generateSelectorsZeusTypeScript = ({ query, mutation, subscription }: Partial<ResolvedOperations>): string[] => {
  const allOps: string[] = [];
  if (query?.operationName?.name && query.operations.length) {
    allOps.push(generateSelectorZeus(query.operationName, OperationType.query));
  }
  if (mutation?.operationName?.name && mutation.operations.length) {
    allOps.push(generateSelectorZeus(mutation.operationName, OperationType.mutation));
  }
  if (subscription?.operationName?.name && subscription.operations.length) {
    allOps.push(generateSelectorZeus(subscription.operationName, OperationType.subscription));
  }
  return allOps;
};

const generateOperationCast = (t: OperationName, ot: OperationType): string =>
  `${ot}: ((o: any) => (b: any) => o) as CastToGraphQL<
  ValueTypes["${t.name}"],
  ${t.name}
>`;

const generateOperationsCastTypeScript = ({ query, mutation, subscription }: Partial<ResolvedOperations>): string[] => {
  const allOps: string[] = [];
  if (query?.operationName?.name && query.operations.length) {
    allOps.push(generateOperationCast(query.operationName, OperationType.query));
  }
  if (mutation?.operationName?.name && mutation.operations.length) {
    allOps.push(generateOperationCast(mutation.operationName, OperationType.mutation));
  }
  if (subscription?.operationName?.name && subscription.operations.length) {
    allOps.push(generateOperationCast(subscription.operationName, OperationType.subscription));
  }
  return allOps;
};

export const bodyTypeScript = (env: Environment, resolvedOperations: ResolvedOperations): string => `
${graphqlErrorTypeScript}
${constantTypesTypescript}
${typescriptFunctions(env)}

export const Chain = (...options: fetchOptions) => ({
  ${generateOperationsChaining(resolvedOperations).join(',\n')}
});
export const Zeus = {
  ${generateOperationsZeusTypeScript(resolvedOperations).join(',\n')}
};
export const Cast = {
  ${generateOperationsCastTypeScript(resolvedOperations).join(',\n')}
};
export const Selectors = {
  ${generateSelectorsZeusTypeScript(resolvedOperations).join(',\n')}
};
  `;
