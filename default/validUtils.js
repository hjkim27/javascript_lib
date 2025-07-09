/**
 * @description 정규식 패턴 확인 관련 함수 모음
 * @since 2025.04
 */
var VALID_UTILS = {
    /**
     * <pre>
     *     정규식 패턴 모음
     * </pre>
     */
    regex_patterns: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        // 영문자, 숫자, 특수문자 1개 이상 포함해 8자 이상 20자 이하
        password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{}[\]:;"'<>,.?/~`]).{8,20}$/,
        // IPv4 형식 확인
        ip: /^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$/
    },
    /**
     * <pre>
     *     정규식에 맟는 패턴인지 확인
     * </pre>
     *
     * @param str
     * @param regPattern
     * @returns {boolean}
     */
    isValid: (str, regPattern) => {
        const pattern = (regPattern instanceof RegExp) ? regPattern : new RegExp(regPattern);
        return pattern.test(str);
    },
    /**
     * 이메일 정규표현식 확인
     * - 영문자, 숫자, 특수문자 1개 이상 포함해 8자 이상 20자 이하
     * @param {string} str
     * @returns {boolean}
     */
    isValidEmail: str => VALID_UTILS.regex_patterns.email.test(str),
    /**
     * 비밀번호 정규표현식 확인
     * @param {string} str
     * @returns {boolean}
     */
    isValidPassword: str => VALID_UTILS.regex_patterns.password.test(str),
    /**
     * IPv4 정규표현식 확인
     * @param {string} str
     * @returns {boolean}
     */
    isValidIP: str => VALID_UTILS.regex_patterns.ip.test(str)
}