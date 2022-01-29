class StarRater extends HTMLElement {
    constructor() {
        super();

        this.build()
            .then(() => console.log('The component has been created'))
    }

    async build() {
        await this.setAttributes()

        const shadow = this.attachShadow({ mode: 'open'})

        shadow.appendChild(this.styles())

        const rater = await this.createRater()
        this.stars  = await this.createStars()
        await this.stars.forEach(star => rater.appendChild(star))

        await this.resetRating()

        shadow.appendChild(rater)
    }

    setAttributes() {
        this.range = Number(this.getAttribute('data-range')) || 5
        this.styleAttributes = {
            fontSize: this.getAttribute('data-font-size') || '5rem',
            color: this.getAttribute('data-color') || 'gray',
            activeColor: this.getAttribute('data-active-color') || 'yellow'
        }
    }

    createRater() {
        const rater = document.createElement('div')
        rater.classList.add('star-rater')
        rater.addEventListener('mouseout', this.resetRating.bind(this))
        return rater
    }

    createStars() {
        const createStar = (_, id) => {
            const star = document.createElement('span')
            star.classList.add('star')
            star.setAttribute('data-value', Number(id) + 1)
            star.innerHTML = '&#9733'
            star.addEventListener('click', this.setRating.bind(this))
            star.addEventListener('mouseover', this.ratingHover.bind(this))
            return star
        }

        return Array.from({ length: this.range }, createStar)
    }

    resetRating() {
        this.currentRatingValue = Number(this.getAttribute('data-rating')) || 0
        this.highLightRating()
    }

    setRating(event) {
        this.setAttribute(
            'data-rating',
            event.currentTarget.getAttribute('data-value')
        )
    }

    ratingHover(event){
        this.currentRatingValue = Number(event.currentTarget.getAttribute('data-value'))
        this.highLightRating()
    }

    highLightRating(){
        this.stars.forEach(star => {
            star.style.color =
                this.currentRatingValue >= Number(star.getAttribute('data-value'))
                ? this.styleAttributes.activeColor
                    : this.styleAttributes.color
        })
    }

    styles() {
        const style = document.createElement('style')
        style.textContent = `
            .star {
                font-size: ${this.styleAttributes.fontSize};
                color: ${this.styleAttributes.color};
                cursor: pointer;
            }
        `
        return style
    }
}

customElements.define('star-rater', StarRater)