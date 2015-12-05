/** @flow **/

import {createElement} from 'react';
import {mapValues, reduce, constant} from 'lodash-fp';

type Dict<T> = {[index: string]: T};

type Renderer<T> = {
  (props: Dict<{}>): T
};

type PartialComponent = {
  name: string,
  props: Dict<Renderer>,
  children: Dict<Renderer<{}[]>>,
  text?: Dict<Renderer<string>>
};

type ComponentTrait = {
  (component: PartialComponent): PartialComponent
};



export default function component(...traits: ComponentTrait[]): ReactClass {
  const componentSpec = reduce(applyTrait, baseComponent, traits);

  const propRenderers = componentSpec.props;
  const renderType = componentSpec.type;
  const renderChildren = componentSpec.text ?
    (props) => [componentSpec.text(props)] :
    componentSpec.children
  ;

  const Component = (inProps) => {
    const applyRenderers = mapValues(render => render(inProps));

    return createElement(
      renderType(inProps),
      applyRenderers(propRenderers),
      ...renderChildren(inProps)
    );
  };

  Component.displayName = componentSpec.name;

  return Component;
}


function applyTrait(prev: PartialComponent, trait: ComponentTrait): PartialComponent {
  return trait(prev);
}


const baseComponent: PartialComponent = {
  type: constant('div'),
  props: constant({}),
  children: constant([]),
  name: 'Unnamed Component'
};
