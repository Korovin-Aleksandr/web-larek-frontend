export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
	
};

export const constraintsUser = {
	address: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		length: {
			minimum: 2,
			maximum: 40,
        }
	},
    email:  {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		length: {
			minimum: 2,
			maximum: 40,
        }
	},
    phone:   {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		length: {
			minimum: 2,
			maximum: 40,
        }
	}
};