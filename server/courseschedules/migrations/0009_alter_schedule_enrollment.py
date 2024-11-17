# Generated by Django 5.0.6 on 2024-11-17 16:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("academics", "0017_alter_instructor_expertise"),
        ("courseschedules", "0008_schedule_enrollment"),
    ]

    operations = [
        migrations.AlterField(
            model_name="schedule",
            name="enrollment",
            field=models.ForeignKey(
                default=8,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="schedules",
                to="academics.enrollment",
            ),
            preserve_default=False,
        ),
    ]
