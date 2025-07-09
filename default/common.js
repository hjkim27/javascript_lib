/**
 * @description 기타 input 데이터 값 관련 동작을 위한 js 함수 모음
 * @since 2025.04
 */
var propInput = {
    /**
     * <pre>
     *     일괄선택 체크박스 클릭 시 모든 체크박스를 일괄 체크와 동일하게 한다.
     *     ex: allCheck(this, undefined, false) => 일괄체크박스의 name 속성의 값과 같은 name 을 가진 체크박스를 대상으로 일괄 체크 진행 (본인제외)
     *      - 동일한 방법 : allCheck(this)
     *     ex: allCheck(this, undefined, true) => 일괄체크박스의 data-name 속성의 값과 같은 name 을 가진 체크박스를 대상으로 일괄 체크 진행 (본인제외)
     * </pre>
     *
     * @param item 일괄체크박스 태그 
     * @param checkboxNameTarget 일괄체크박스의 어떤 속성으로 checkbox 를 구분할지에 대한 값. (ex: name, id, ...)
     * @param isData data속성을 조회하고자 할 경우
     *
     */
    allCheck: function (item, checkboxNameTarget = 'name', isData = false) {
        const $item = $(item);
        let $checkInputName = isData ? $item.data(checkboxNameTarget) : $item.attr(checkboxNameTarget);
        $('[name="' + $checkInputName + '"]').not($item).prop('checked', $item.is(':checked'));
    }
}