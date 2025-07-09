/**
 * @description parameter 표현식이나 input 입력 값등에 대한 유틸 함수 모음.
 * @since 2025.04
 *
 * <pre>
 * 사용예시
 * - snakeToCamel('sample_code');    // sampleCode
 * - getCheckedInputValues('day');   // ['mon', 'tue', ..'fri']
 * </pre>
 */
var paramChecker = {
    /**
     * snake case to camel case
     * @param str
     * @returns {string}
     */
    snakeToCamel: function (str) {
        return str.replace(
            /(?!^)_(.)/g,
            (_, char) => char.toUpperCase()
        );
    },
    /**
     * @param val
     * @returns {boolean}
     */
    isEmpty: function (val) {
        return val === null || val === undefined || (typeof val === 'string' && val.trim() === '');
    },
    /**
     * <pre>
     *     checkbox, radio 등의 input 들의 체크된 값을 목록으로 조회한다.
     * </pre>
     * @param {string} targetName 속성명 (ex: id, name ...)
     * @param {string} targetType 속성구분 (ex: id, name, value, ...)
     * @param {boolean} isData true: data 속성 반환 / false: value 반환
     * @returns {Array[string]}
     */
    getCheckedInputValues: function (targetName, targetType = 'value', isData = true) {
        if (targetName == undefined) {
            return;
        }
        return $('[name="' + targetName + '"]:checked').map(function (idx, item) {
            if (isData) {
                return $(item).data(targetType);
            } else {
                return $(item).val();
            }
        }).get();
    },
    /**
     * <pre>
     *     check된 input 의 값이 없을 경우 true, 하나라도 있으면 false
     * </pre>
     *
     * @param {string} targetName 속성명 (ex: id, name ...)
     * @returns {boolean}
     */
    isEmptyCheckValues: function (targetName) {
        const $selector = $('[name="' + targetName + '"]');
        return $selector.filter(':checked').length === 0;
    },
    /**
     * <pre>
     *     모든 checkbox 가 체크된 상태일 경우 true 반환
     * </pre>
     * @param {string} targetName 속성명 (ex: id, name, parameter ...)
     * @returns {boolean}
     */
    isAllCheckValues: function (targetName) {
        const $selector = $('[name="' + targetName + '"]');
        const $totalLength = $selector.length;
        const checkCount = $selector.filter(':checked').length;
        return $totalLength > 0 && $totalLength === checkCount;
    }
}
