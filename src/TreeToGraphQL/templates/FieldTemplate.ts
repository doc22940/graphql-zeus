import { ParserField } from '../../Models';
import { TemplateUtils } from './TemplateUtils';
import { Template } from './Template';

/**
 * Template for GraphQL Field
 */
export class FieldTemplate extends Template {
  static resolve(f: ParserField): string {
    let argsString = '';
    if (f.args && f.args.length) {
      argsString = `(\n${f.args
        .map(TemplateUtils.resolverForConnection)
        .map((a) => `\t${a}`)
        .join('\n')}\n\t)`;
    }
    return `${TemplateUtils.descriptionResolver(f.description, '\t')}\t${
      f.name
    }${argsString}: ${TemplateUtils.resolveType(f)}${TemplateUtils.resolveDirectives(f.directives)}`;
  }
}
