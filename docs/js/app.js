const $ = sel => document.querySelectorAll(sel);
const $1 = sel => document.querySelector(sel);
$.on = (sel, type, action) => $1(sel).addEventListener(type, action);
$.el = html => {
  let tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.children[0];
}
$.appendChild = (target, element) => {
  if (typeof target === 'string') target = $1(target);
  if (typeof element === 'string') element = $.el(element);
  target.appendChild(element);
  return target;
}

!function() {
  $.on('input.new-todo', 'keydown', async ({ currentTarget, keyCode }) => {
    if (keyCode !== 13) return;
    let data = await fetch('/todo/insert', { text: currentTarget.value, isCompleted: false });
    let new_li = $.el(`
      <li class="${data.isCompleted ? 'completed' : ''}" data-id="${data.id}">
        <input type="checkbox" class="toggle">
        <label>${data.text}</label>
        <button class="delete"></button>
      </li>`);

    $.appendChild('ul.todo-list', new_li);
  });

}()