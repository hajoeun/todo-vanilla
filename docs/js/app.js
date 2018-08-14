const $ = sel => document.querySelectorAll(sel);
const $1 = sel => document.querySelector(sel);
$.on = (sel, type, action) => $1(sel).addEventListener(type, action);
$.el = html => {
  let tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.children[0];
};
$.appendChild = (target, element) => {
  if (typeof target == 'string') target = $1(target);
  if (typeof element == 'string') element = $.el(element);
  target.appendChild(element);
  return element;
};
$.attr = (target, attr, value) => {
  return value === undefined ? 
    target.getAttribute(attr) : target.setAttribute(attr, value);
};

!async function() {

  const li_html = data => `
    <li class="${data.completed ? 'completed' : ''}" data-id="${data.id}">
      <input type="checkbox" class="toggle" ${data.completed ? 'checked' : ''}>
      <label>${data.title}</label>
      <button class="delete"></button>
    </li>`;

  const delete_event = async ({ currentTarget }) => {
    await fetch('/todo/delete', { id: $.attr(currentTarget.parentNode, 'data-id') });
    currentTarget.parentNode.remove();
  }

  const check_event = async ({ currentTarget }) => {
    let set = { completed: currentTarget.checked ? 1 : 0 };
    let where = { id: $.attr(currentTarget.parentNode, 'data-id') };
    let res = await fetch('/todo/update', { set, where });
    currentTarget.parentNode.classList = res.completed ? 'completed' : '';
  }

  for (let data of await fetch('/todo/all', {})) {
    let li_element = $.appendChild('ul.todo-list', li_html(data));
    li_element.querySelector('.delete').onclick = delete_event;
    li_element.querySelector('.toggle').onclick = check_event;
  }

  $.on('input.new-todo', 'keydown', async ({ currentTarget, keyCode }) => {
    if (keyCode !== 13) return;
    let data = await fetch('/todo/insert', { title: currentTarget.value, completed: false });
    let li_element = $.appendChild('ul.todo-list', li_html(data));
    li_element.querySelector('.delete').onclick = delete_event;
    li_element.querySelector('.toggle').onclick = check_event;
    currentTarget.value = '';
  });

}()
