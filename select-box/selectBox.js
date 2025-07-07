class selectBox {
    constructor(selectBoxId, callbackFunc) {
        this.selectBoxId = selectBoxId;
        this.callbackFunc = callbackFunc;
        this.fixSelectedText = false;

        // selectbox 로 동작하기 위한 div. select된 텍스트와 options 를 포함하고 있음.
        this.$selectBox = $('#' + selectBoxId);
        // selectbox 처럼 보여주기 위한 div. options 가 열리지 않았을 경우 선택된 값을 보여줌
        this.$selected = this.$selectBox.find('.selected:not(.option)');
        // select 태그 내 옵션 목록을 감싸고 있는 태그 (outer)
        this.$options = this.$selectBox.find('.options');
        // select 태그 내 옵션 목록을 감싸고 있는 태그 (inner) overflow: scroll 처리를 위해 추가되었음.
        this.$optionsInner = this.$selectBox.find('.options-inner');
        // select 태그 내 옵션의 저장/취소 버튼 확인
        this.$optionsButton = this.$selectBox.find('.options-button');
        // 현재 선택된 옵션의 이름을 보여주기 위한 div 태그
        // - `disabled` 로 시작하는 클래스를 가지고 있을 경우 비활성화
        // - `fit-text` 클래스가 없을 경우 options 에 따른 width 를 지정
        this.$selectedText = this.$selectBox.find('.selected-text');
        // 현재 선택된 옵션의 값을 저장해두기 위한 `input[type="hidden"]` 태그
        this.$hiddenInput = this.$selectBox.find('input[type="hidden"]');

        this._init();
    }

    _init() {
        // 기본 selected 및 크기 설정
        this._initLayout();

        // 클릭 이벤트 등록
        this.$selected.off().on('click', function () {
            self._toggleOptions();
        });

        //옵션 버튼이 있는 경우
        if (this.$optionsButton.length > 0) {
            const hasCheckbox = this.$optionsInner.find('input[type="checkbox"]').length > 0;
            if (hasCheckbox) {
                this.$optionsInner.addClass('option-checkbox');
            }

            this.$optionsButton.off().on('click', 'button', function () {
                const $btnType = $(this).attr('name');
                const isSubmit = $btnType == 'submit';
                if (isSubmit && typeof self.callbackFunc == 'function') {
                    self.callbackFunc();
                } else {
                    self.$optionsInner.find('input[type="checkbox"]').each(function (e) {
                        const dataValue = $(this).data('value');
                        $(this).prop('checked', dataValue)
                    })
                }
            });
        } else {
            // 옵션 클릭 이벤트
            this.$options.off().on('click', '.option', function () {
                self._onOptionClick($(this));
            });
        }

        // 외부 클릭 시 닫기
        $(document).off('click.selectBox').on('click.selectBox', function (e) {
            $('.custom-select').each(function () {
                const $thisSelect = $(this);
                if (!$thisSelect.is(e.target) && $thisSelect.has(e.target).length === 0) {
                    $thisSelect.find('.options').hide();
                    $thisSelect.find('.select-icon').removeClass('rotated');
                    $thisSelect.find('.open-select').removeClass('open-select');
                }
            });
        });
    }

    /**
     * 기본 selected 및 크기 설정
     * @private
     */
    _initLayout() {
        // options 의 최대 height 와 selected 의 width 계산을 위해 잠깐 나타나기
        this.$options.css({visibility: 'hidden', display: 'block'});

        // option 높이와 `showOptionCount`를 기반으로 max-height 제한
        // $optionsInner 의 첫번쨰 요소를 대상으로 하도록 수정
        const $heightCheckTag = this.$optionsInner.children().first();
        if ($heightCheckTag.length) {
            const optionHeight = $heightCheckTag.outerHeight();
            const maxHeight = optionHeight * 5;
            this.$optionsInner.css('max-height', maxHeight + 'px');
        }

        // options width 기반으로 width 제한
        this.$options.css('width', this.$selected.outerWidth() + 'px');

        const $selectedOption = this.$optionsInner.find('.option.selected');
        // selected-text 가 있을 경우에만 동작하도록 조건 처리
        if ($selectedOption.length > 0) {
            // option 내 span 이 있을 경우 span 안에 있는 내용은 selected-text 에서 제외하도록 조건 처리
            const $subText = $selectedOption.find('span');
            let currentText = $selectedOption.text();
            if ($subText.length > 0) {
                currentText = $selectedOption.clone().children().remove().end().text().trim();
            }
            // 선택된 option 표시
            // init 시 selectedText 값이 있으면 변경하지 않도록 함.
            if (this.$selectedText.text().length == 0) {
                this.$selectedText.text(currentText);
            }
            // 옵션에 해당하는 값을 hidden 에 세팅
            this.$hiddenInput.val($selectedOption.data('value'))

            // 'fit-text' 클래스가 없는 selected-text 일 경우 selected 사이즈 조정
            if (this.$selectedText.length && !this.$selectedText.hasClass('fit-text')) {
                if (this.$options.outerWidth() !== 0) {
                    this.$selected.css('width', this.$options.outerWidth());
                }
            }
            // 다시 숨기기
            this.$options.css({display: 'none', visibility: ''});
        }
    }

    /**
     * selectbox 클릭
     * @private
     */
    _toggleOptions() {
        // selectedText 가 존재하고 'disabled' 로 시작하는 class 를 가지고 있을 경우 비활성화
        if (this.$selectedText.length && Array.from(this.$selectedText[0].classList).some(c => c.startsWith('disabled'))) {
            return;
        }

        // select 클릭 시 클릭한 버튼 외 다른 select 닫기
        $('.custom-select .options').not(this.$options).hide();
        // 다른 select 들의 아이콘 되돌리기
        $('.custom-select .select-icon').not(this.$selected.find('.select-icon')).removeClass('rotated');

        const selectOffset = this.$selectBox.offset();
        const selectHeight = this.$selectBox.outerHeight();
        const optionsHeight = this.$options.outerHeight();
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();

        const spaceBelow = windowHeight - (selectOffset.top - scrollTop + selectHeight);
        const spaceAbove = selectOffset.top - scrollTop;

        // [2025.06.04] inline style 적용을 위해 css 클래스로 분리
        if (spaceBelow < optionsHeight && spaceAbove > optionsHeight) {
            // 위로 열기
            this.$options.removeClass('open-down').addClass('open-up');
        } else {
            // 아래로 열기
            this.$options.removeClass('open-up').addClass('open-down');
        }
        // 현재 열려있는 selectedbox 구분용 (css 커스텀이 필요한 경우 사용)
        this.$selected.addClass('open-select');

        // 토글 회전 효과
        this.$selected.find('.select-icon').toggleClass('rotated');
        this.$options.toggle();
    }

    /**
     * 옵션 선택에 대한 이벤트 처리
     * @param $option
     * @private
     */
    _onOptionClick($option) {
        // option 내 span 이 있을 경우 span 안에 있는 내용은 selected-text 에서 제외하도록 조건 처리
        let value = $option.text();
        const $subText = $option.find('span');
        if ($subText) {
            value = $option.clone().children().remove().end().text().trim();
        }

        // 클릭 시 fixSelectText 값이 false 일 경우에만 선택한 값으로 text 를 변경
        if (!this.fixSelectedText) {
            this.$selectedText.text(value);
        }


        // 옵션 선택 시 해당 옵션태그에 selected 클래스를 추가해 실제 선택된것처럼 css 효과 추가
        this.$options.find('.option').removeClass('selected');
        $option.addClass('selected');

        // selectbox 에 아이콘이 있을 경우 해당 아이콘을 돌림.
        this.$selected.find('.select-icon').toggleClass('rotated');
        this.$options.toggle().hide();

        // 선택한 옵션의 data-value 값을 java 단으로 넘겨 쓸 수 있도록 hidden input 에 값 설정
        // dataType 값이 존재할 경우 callback parameter 로 this 를 넘기도록 함.
        const dataValue = $option.data('value');
        if (this.$hiddenInput.length) {
            this.$hiddenInput.val(dataValue);
        }

        // selectedbox 닫힘 확인
        $('.custom-select .open-select').removeClass('open-select');

        // callback 함수가 필요할 경우 호출.
        if (this.callbackFunc != undefined) {
            // data-value 가 있을 경우 callbackFunc 에 파라미터로 전달
            // [2025.04.15] pageSize 의 경우 pageSize 를 currentPage 로 보내는 문제가 있어 예외처리 추가
            if (dataValue != undefined) {
                this.callbackFunc($option[0])
            }
        } else {
            this.callbackFunc();
        }
    }

    /* [유틸/외부 API 메서드 추가] ============================================ */
    /**
     * 옵션 추가
     * @param text
     * @param value
     * @param isSelected
     * @returns {selectBox}
     */
    addOption(text, value, isSelected) {
        const $newOption = $('<div>').addClass('option').text(text).attr('data-value', value);
        this.$optionsInner.append($newOption);
        if (isSelected) {
            this.$optionsInner.find('.option').removeClass('selected');
            $newOption.addClass('selected');
            this.$selectedText.text(text);
            this.$hiddenInput.val(value);
        }
        return this;
    }

    /**
     * selectedText 값 변경여부 확인용 변수 수정
     * @param fix
     * @returns {selectBox}
     */
    setSelectedText(fix) {
        this.fixSelectedText = fix;
        return this;
    }

    /**
     * select box 버튼 크기 고정
     * @param width
     * @returns {selectBox}
     */
    fixWidth(width) {
        this.$selectBox.css('width', width);
        this.$selected.css('width', width);
        return this;
    }

    /**
     * selectBox 옵션 폼의 width 고정
     * @param width
     * @param isCustom
     * @returns {selectBox}
     */
    fixOptionWidth(width, isCustom) {
        if (isCustom) {
            this.$options.css('width', this.$options.outerWidth() + width + 'px');
        } else {
            this.$options.css('width', width);
        }
        return this;
    }

    /**
     * selectBox 의 최대 보여지는 count 수 고정. 초과된 값이 있을 경우 scroll 추가
     * @param count
     * @returns {selectBox}
     */
    fixOptionViewCount(count) {
        const $option = this.$optionsInner.find('.option').first();
        if ($option.length) {
            const optionHeight = $option.outerHeight();
            this.$optionsInner.css('max-height', optionHeight * count + 'px');
        }
        return this;
    }

    /**
     * callback 함수 추가 설정
     * @param func
     * @returns {selectBox}
     */
    setCallbackFunc(func) {
        if (typeof func == 'function') {
            this.callbackFunc = func;
        }
        return this;
    }
}