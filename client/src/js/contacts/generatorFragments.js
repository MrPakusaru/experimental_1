/**
 * Набор генераторов базовых фрагментов. На их основе генерируются более сложные элементы.
 */
export class GeneratorFragments {
    /**
     * Генерирует окно с заголовком, управляющими элементами вверху справа, и содержимым внути окна
     * @param classWindow {string} Атрибут `class` для нового 'окна'
     * @param headText {string} Текст заголовка 'окна'
     * @param headItems {(*|jQuery)[]} Элементы, входящие в 'шапку окна'
     * @param innerItems {(*|jQuery)[]} Элементы внутри тела 'окна'
     * @returns {jQuery} Готовый jQuery объект для вставки в страницу
     */
    static genElementWindow(classWindow, headText = null, headItems = null, innerItems = null) {
        return $('<div>', {class: 'window'}).addClass(classWindow).append(
            $('<div>', {class: 'window_bar'}).append(
                $('<div>', {class: 'window_b_head'}).text(headText),
                $('<div>', {class: 'window_b_items'}).append(
                    headItems?.map((item) => item.addClass('window_b_item')) ?? null
                )
            ),
            $('<div>', {class: 'window_inner'}).append(innerItems)
        );
    }

    /**
     * Возвращает набор элементов options с 12 месяцами и одним пустым значением (val:'none')
     * @returns {jQuery[]}
     */
    static genMonthOptions() {
        const formatter = new Intl.DateTimeFormat('default', {month: 'long'});
        return [
            $('<option selected>').val('none'),
            ...Array.from({length: 12}, (_, num) =>
                $('<option>').val(num+1).text(formatter.format(new Date().setMonth(num)))
            )
        ]
    }
}