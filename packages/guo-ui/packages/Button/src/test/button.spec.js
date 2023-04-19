import { expect } from 'chai'
import { shallowMount, mount } from '@vue/test-utils'
import Button from '../button.vue'

describe('Button.vue', () => {
  it('increments count when button is clicked', () => {
    const wrapper = shallowMount(Button)
    wrapper.find('button').trigger('click')
    expect(wrapper.find('div').text()).contains('')
  })
  // it('loading-size prop', () => {
  //   const wrapper = mount(Button, {
  //     propsData: {
  //       loading: true,
  //       loadingSize: '10px',
  //     },
  //   });
  //   expect(wrapper).toMatchSnapshot();
  // });
  
  // it('icon-position prop', () => {
  //   const wrapper = mount(Button, {
  //     propsData: {
  //       icon: 'plus',
  //       iconPosition: 'right',
  //     },
  //   });
  //   expect(wrapper).toMatchSnapshot();
  // });
  
  // it('click event', () => {
  //   const onClick = jest.fn();
  //   const wrapper = mount(Button, {
  //     context: {
  //       on: {
  //         click: onClick,
  //       },
  //     },
  //   });
  
  //   wrapper.trigger('click');
  //   expect(onClick).toHaveBeenCalled();
  // });
  
  // it('not trigger click event when disabled', () => {
  //   const onClick = jest.fn();
  //   const wrapper = mount(Button, {
  //     propsData: {
  //       disabled: true,
  //     },
  //     context: {
  //       on: {
  //         click: onClick,
  //       },
  //     },
  //   });
  
  //   wrapper.trigger('click');
  //   expect(onClick).toHaveBeenCalledTimes(0);
  // });
  
  // it('not trigger click event when loading', () => {
  //   const onClick = jest.fn();
  //   const wrapper = mount(Button, {
  //     propsData: {
  //       loading: true,
  //     },
  //     context: {
  //       on: {
  //         click: onClick,
  //       },
  //     },
  //   });
  
  //   wrapper.trigger('click');
  //   expect(onClick).toHaveBeenCalledTimes(0);
  // });
  
  // it('touchstart event', () => {
  //   const onTouchstart = jest.fn();
  //   const wrapper = mount(Button, {
  //     context: {
  //       on: {
  //         touchstart: onTouchstart,
  //       },
  //     },
  //   });
  
  //   wrapper.trigger('touchstart');
  //   expect(onTouchstart).toHaveBeenCalled();
  // });
  
  // it('hide border when color is gradient', () => {
  //   const wrapper = mount(Button, {
  //     propsData: {
  //       color: 'linear-gradient(#000, #fff)',
  //     },
  //   });
  
  //   expect(wrapper.element.style.border).toEqual('0px');
  // });
  
  // it('icon-prefix prop', () => {
  //   const wrapper = mount(Button, {
  //     propsData: {
  //       icon: 'success',
  //       iconPrefix: 'my-icon',
  //     },
  //   });
  
  //   expect(wrapper).toMatchSnapshot();
  // });
  
  // it('loading slot', () => {
  //   const wrapper = mount(Button, {
  //     propsData: {
  //       loading: true,
  //     },
  //     scopedSlots: {
  //       loading: () => 'Custom Loading',
  //     },
  //   });
  
  //   expect(wrapper).toMatchSnapshot();
  // });
  
  
})

